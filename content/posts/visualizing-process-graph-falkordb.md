---
title: "Visualizing My Mac Process Tree with FalkorDB"
description: "A quick snapshot script, a tiny Docker container, and a graph view of how processes spawn on macOS."
date: "2025-12-24"
category: "Development, Terminal"
legacyUrl: "/posts/2025-12-24-visualizing-process-graph-falkordb.html"
---

<section>
<p>I have been looking for small datasets to graph, mainly to see what feels smooth and what feels like a hassle. The macOS process tree is an obvious candidate. Every process has a parent, a lot have children, and the shape is already a graph.</p>
<p>I knew I wanted to turn <code>ps</code> output into nodes and edges, so I picked FalkorDB. It is in memory, it is disposable, and it lets me load a snapshot, poke around, and shut it down. I do not have to set anything up beyond the container, so I can load the data and move on.</p>
</section>

<section>
<h2>Run FalkorDB in Docker</h2>

<p>This runs FalkorDB locally on the Redis port. I use Docker so I can toss the container when I am done:</p>

```
docker run --name falkordb -p 6379:6379 falkordb/falkordb:edge
```
</section>

<section>
<h2>Why In Memory Helps</h2>

<p>I am not building a forever database here. I want a snapshot I can explore, then throw away. FalkorDB lets me treat the graph like a scratchpad. Run it, load it, query it, delete it. That is the whole workflow.</p>
</section>

<section>
<h2>Snapshot My Process Tree into a Graph</h2>

<p>The loader lives at <code>scripts/falkordb-process-snapshot.mjs</code>. It is AI-generated, so read it like a draft and tweak as needed. It runs <code>ps</code> on macOS, parses the output, and inserts:</p>

<ul>
<li><strong>Process nodes</strong> with pid, ppid, user, cpu, memory, start time, and command</li>
<li><strong>PARENT_OF edges</strong> from each parent process to its child</li>
</ul>

<p>Run it like this:</p>

```
node scripts/falkordb-process-snapshot.mjs --host 127.0.0.1 --port 6379 --graph process_graph
```

<p>The script prints a snapshot id so I can query that exact view later and keep multiple runs side by side.</p>
</section>

<section class="code-section">
<h2>The Script</h2>

<p>Here is the full loader script so you can reuse it:</p>

```js
import { execSync } from "node:child_process";
import net from "node:net";
import os from "node:os";

const DEFAULT_GRAPH = "process_graph";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 3000;
const BATCH_SIZE = 200;

function parseArgs(argv) {
  const args = {
    graph: DEFAULT_GRAPH,
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    user: "default",
    password: "",
    clear: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--graph") args.graph = argv[++i];
    else if (arg === "--host") args.host = argv[++i];
    else if (arg === "--port") args.port = Number(argv[++i]);
    else if (arg === "--user") args.user = argv[++i];
    else if (arg === "--password") args.password = argv[++i];
    else if (arg === "--clear") args.clear = true;
  }

  if (!Number.isFinite(args.port)) {
    throw new Error("Invalid --port value.");
  }

  return args;
}

function getProcessListMac() {
  const psCommand =
    "ps -axo pid=,ppid=,user=,uid=,gid=,stat=,%cpu=,%mem=,rss=,vsz=,lstart=,command=";
  const output = execSync(psCommand, { encoding: "utf8" }).trim();
  if (!output) return [];

  return output.split("\n").map((line) => {
    const parts = line.trim().split(/\s+/);
    const [
      pid,
      ppid,
      user,
      uid,
      gid,
      stat,
      cpu,
      mem,
      rss,
      vsz,
      ...rest
    ] = parts;
    const lstartParts = rest.slice(0, 5);
    const commandParts = rest.slice(5);
    const startRaw = lstartParts.join(" ");
    const startDate = startRaw ? new Date(startRaw) : null;

    return {
      pid: Number(pid),
      ppid: Number(ppid),
      user,
      uid: Number(uid),
      gid: Number(gid),
      stat,
      cpu: Number(cpu),
      mem: Number(mem),
      rss: Number(rss),
      vsz: Number(vsz),
      start_time: startDate && !Number.isNaN(startDate.getTime())
        ? startDate.toISOString()
        : null,
      start_time_raw: startRaw || null,
      command: commandParts.join(" "),
    };
  });
}

function escapeCypherString(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function cypherValue(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "null";
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${escapeCypherString(String(value))}'`;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

class RespClient {
  constructor({ host, port }) {
    this.socket = net.createConnection({ host, port });
    this.buffer = Buffer.alloc(0);
    this.waiters = [];
    this.socket.on("data", (chunk) => this.#onData(chunk));
    this.socket.on("error", (err) => this.#rejectAll(err));
    this.socket.on("close", () => this.#rejectAll(new Error("Socket closed.")));
  }

  #rejectAll(err) {
    while (this.waiters.length) {
      this.waiters.shift().reject(err);
    }
  }

  #onData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.waiters.length) {
      const parsed = this.#parseValue(0);
      if (!parsed) break;
      const { value, nextIndex, error } = parsed;
      this.buffer = this.buffer.slice(nextIndex);
      const waiter = this.waiters.shift();
      if (error) waiter.reject(error);
      else waiter.resolve(value);
    }
  }

  #parseLine(startIndex) {
    const endIndex = this.buffer.indexOf("\r\n", startIndex);
    if (endIndex === -1) return null;
    const line = this.buffer.toString("utf8", startIndex, endIndex);
    return { line, nextIndex: endIndex + 2 };
  }

  #parseValue(startIndex) {
    if (this.buffer.length <= startIndex) return null;
    const prefix = String.fromCharCode(this.buffer[startIndex]);
    if (prefix === "+") {
      const line = this.#parseLine(startIndex + 1);
      if (!line) return null;
      return { value: line.line, nextIndex: line.nextIndex };
    }
    if (prefix === "-") {
      const line = this.#parseLine(startIndex + 1);
      if (!line) return null;
      return {
        error: new Error(line.line),
        nextIndex: line.nextIndex,
      };
    }
    if (prefix === ":") {
      const line = this.#parseLine(startIndex + 1);
      if (!line) return null;
      return { value: Number(line.line), nextIndex: line.nextIndex };
    }
    if (prefix === "$") {
      const line = this.#parseLine(startIndex + 1);
      if (!line) return null;
      const length = Number(line.line);
      if (length === -1) {
        return { value: null, nextIndex: line.nextIndex };
      }
      const end = line.nextIndex + length + 2;
      if (this.buffer.length < end) return null;
      const value = this.buffer.toString(
        "utf8",
        line.nextIndex,
        line.nextIndex + length,
      );
      return { value, nextIndex: end };
    }
    if (prefix === "*") {
      const line = this.#parseLine(startIndex + 1);
      if (!line) return null;
      const count = Number(line.line);
      if (count === -1) {
        return { value: null, nextIndex: line.nextIndex };
      }
      const values = [];
      let cursor = line.nextIndex;
      for (let i = 0; i < count; i += 1) {
        const parsed = this.#parseValue(cursor);
        if (!parsed) return null;
        if (parsed.error) return parsed;
        values.push(parsed.value);
        cursor = parsed.nextIndex;
      }
      return { value: values, nextIndex: cursor };
    }
    return {
      error: new Error(`Unknown RESP prefix: ${prefix}`),
      nextIndex: this.buffer.length,
    };
  }

  sendCommand(args) {
    const payload = this.#encodeCommand(args);
    this.socket.write(payload);
    return new Promise((resolve, reject) => {
      this.waiters.push({ resolve, reject });
    });
  }

  #encodeCommand(args) {
    const parts = [`*${args.length}\r\n`];
    for (const arg of args) {
      const value = String(arg ?? "");
      parts.push(`$${Buffer.byteLength(value)}\r\n${value}\r\n`);
    }
    return parts.join("");
  }

  close() {
    this.socket.end();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const processes = getProcessListMac();
  const snapshotId = `${Date.now()}`;
  const snapshotTime = new Date().toISOString();
  const host = os.hostname();
  const osInfo = `${os.type()} ${os.release()}`;

  const client = new RespClient({ host: args.host, port: args.port });

  try {
    if (args.password) {
      if (args.user) {
        await client.sendCommand(["AUTH", args.user, args.password]);
      } else {
        await client.sendCommand(["AUTH", args.password]);
      }
    }

    if (args.clear) {
      await client.sendCommand(["GRAPH.DELETE", args.graph]);
    }

    const snapshotQuery = [
      "CREATE (:Snapshot {",
      `id: ${cypherValue(snapshotId)},`,
      `timestamp: ${cypherValue(snapshotTime)},`,
      `host: ${cypherValue(host)},`,
      `os: ${cypherValue(osInfo)}`,
      "});",
    ].join(" ");

    await client.sendCommand(["GRAPH.QUERY", args.graph, snapshotQuery]);

    const nodeChunks = chunkArray(processes, BATCH_SIZE);
    for (const chunk of nodeChunks) {
      const rows = chunk.map((proc) => {
        const props = {
          pid: proc.pid,
          ppid: proc.ppid,
          user: proc.user,
          uid: proc.uid,
          gid: proc.gid,
          stat: proc.stat,
          cpu: proc.cpu,
          mem: proc.mem,
          rss: proc.rss,
          vsz: proc.vsz,
          start_time: proc.start_time,
          start_time_raw: proc.start_time_raw,
          command: proc.command,
          snapshot_id: snapshotId,
          host,
        };

        return `{ ${Object.entries(props)
          .map(([key, value]) => `${key}: ${cypherValue(value)}`)
          .join(", ")} }`;
      });

      const query = [
        "UNWIND [",
        rows.join(", "),
        "] AS row",
        "CREATE (p:Process)",
        "SET p = row;",
      ].join(" ");

      await client.sendCommand([
        "GRAPH.QUERY",
        args.graph,
        query,
      ]);
    }

    const edges = processes.filter((proc) => proc.ppid && proc.ppid > 0);
    const edgeChunks = chunkArray(edges, BATCH_SIZE);
    for (const chunk of edgeChunks) {
      const rows = chunk.map((proc) => {
        return `{ pid: ${proc.pid}, ppid: ${proc.ppid}, snapshot_id: ${cypherValue(
          snapshotId,
        )} }`;
      });

      const query = [
        "UNWIND [",
        rows.join(", "),
        "] AS row",
        "MATCH (p:Process {pid: row.pid, snapshot_id: row.snapshot_id})",
        "MATCH (parent:Process {pid: row.ppid, snapshot_id: row.snapshot_id})",
        "MERGE (parent)-[:PARENT_OF {snapshot_id: row.snapshot_id}]->(p);",
      ].join(" ");

      await client.sendCommand([
        "GRAPH.QUERY",
        args.graph,
        query,
      ]);
    }

    // Minimal feedback without dumping the graph response.
    console.log(
      `Loaded ${processes.length} processes into graph '${args.graph}' (snapshot ${snapshotId}).`,
    );
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
```

</section>

<section>
<h2>Query a Readable Subgraph</h2>

<p>The full graph is honestly pretty clean once it loads, but I almost always start with a trimmed view so it does not feel overwhelming right away.</p>
<p>The easiest filter is <code>uid &gt;= 500</code>. On macOS that is usually where real user accounts start. It drops launchd, system daemons, and kext noise, and leaves mostly the apps and terminals I actually opened. The structure is way more obvious at a glance.</p>
<p>I always include <code>snapshot_id</code> so different runs stay separate. The path pattern <code>[:PARENT_OF*..3]</code> is just a sweet spot I landed on. It is deep enough to show interesting chains like shell to node to child processes, but shallow enough that the layout does not turn into a hairball. If something looks interesting, I just increase the depth or drop the range entirely.</p>

```
MATCH path=(root:Process {snapshot_id: '1766586365155'})-[:PARENT_OF*..3]->(child)
WHERE root.uid >= 500
RETURN path
LIMIT 150;
```
</section>

<section>
<figure>
<a href="/images/process-graph-falkordb-2025-12-24.png" target="_blank" rel="noopener">
<img src="/images/process-graph-falkordb-2025-12-24.png" alt="FalkorDB graph view showing a user process tree with parent/child edges." width="2502" height="1720" loading="lazy" decoding="async" style="width: 100%; height: auto;">
</a>
<figcaption>Filtered to user processes so the graph is readable. Opens full size in a new tab.</figcaption>
</figure>
</section>

<section>
<h2>Full Snapshot View</h2>

<p>For the full snapshot, I drop the user filter. That brings in launchd and system services and shows how user apps hang off the system tree.</p>

```
MATCH path=(root:Process {snapshot_id: '1766586365155'})-[:PARENT_OF*..3]->(child)
RETURN path;
```

<figure>
<a href="/images/process-graph-falkordb-full-2025-12-24.png" target="_blank" rel="noopener">
<img src="/images/process-graph-falkordb-full-2025-12-24.png" alt="FalkorDB graph view of the full process snapshot with root and branching child chains." width="3248" height="1998" loading="lazy" decoding="async" style="width: 100%; height: auto;">
</a>
<figcaption>The unfiltered snapshot view shows the full process tree around root.</figcaption>
</figure>
</section>

<section>
<h2>Why I Built It</h2>

<p>I built this to get real data into the G.V() UI without spending a weekend inventing a fake dataset. I needed something noisy enough to stress pan, zoom, selection, and path highlighting. A process tree already has IDs and parents, so it loads fast and looks alive.</p>

<p>The nice part is how little it takes to get from “I have a list” to “I have a graph I can explore.” It is just a short script, a container, and one query. If you have any structured list with IDs and parents, you already have a graph. Do not overthink it.</p>

<p>If you give this a shot, swap the process data for whatever you have that already has a parent child or “points to” structure. The shape stays the same and the graph part still works. Some quick ideas:</p>

<ul>
<li>Browser tabs and which tab opened which one.</li>
<li>Build pipeline steps and the command that kicked off each one.</li>
<li>Service calls or API requests linked together by trace IDs.</li>
<li>Git commits connected to the files they changed and the authors who made them.</li>
</ul>

<p>Pretty much any list where things relate to other things is already halfway to being a graph. Plug it in, query it, visualize it. It takes less effort than you think.</p>
</section>
