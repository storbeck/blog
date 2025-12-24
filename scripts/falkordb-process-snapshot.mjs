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
