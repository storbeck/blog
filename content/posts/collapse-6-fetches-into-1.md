---
title: "Collapse 6 Fetches Into 1 with Cap’n Web"
description: "Why chatty pages feel slow and how HTTP batching + pipelining collapses chains of dependent requests into a single round trip (our demo shows six, but it applies to any number)."
date: "2025-10-15"
category: "Performance"
legacyUrl: "/posts/2025-10-15-collapse-6-fetches-into-1.html"
---

<section aria-labelledby="problem">
<h2 id="problem">The Problem: Waterfall Latency</h2>
<p>Modern pages often make a bunch of small API calls in sequence: profile → friends → profiles → notifications → greeting → etc. Each call adds a round trip (RTT). On real networks, ~100–200&nbsp;ms of RTT per call adds up fast: a chain of dependent requests can add hundreds of milliseconds to multiple seconds of latency before any server work. (Our demo uses six calls as an example, but the approach applies to any number of calls.)</p>
</section>

<section aria-labelledby="what">
<h2 id="what">What Cap’n Web Is (and Why It Helps)</h2>
<p><a href="https://blog.cloudflare.com/capnweb-javascript-rpc-library/" rel="external noopener noreferrer">Cap’n Web</a> is a JavaScript‑native RPC library with two key ideas:</p>
<ul>
<li><strong>HTTP batch + pipelining:</strong> queue multiple calls and send them in <em>one</em> request. Promises act like stubs, so you can chain calls before the first resolves.</li>
<li><strong>Capability‑based RPC:</strong> pass references (objects with methods) instead of tokens or IDs. Least‑privilege by default.</li>
</ul>
<p>It also supports long‑lived WebSocket sessions and bidirectional calls, but this post focuses on the one‑RTT HTTP batch because it solves the waterfall pain directly.</p>
</section>

<section aria-labelledby="demo">
<h2 id="demo">Live Demo: 6 REST Calls vs 1 Batch</h2>
<p>Try the side‑by‑side demo:</p>
<p><a href="../capnweb-batch-demo.html" rel="bookmark">Open the Cap’n Web batching demo</a></p>
<p>The left button runs six sequential REST requests. The right button uses a single Cap’n Web HTTP batch that returns six results in one round trip. You can adjust a simulated per‑call server delay to see the effect.</p>
</section>

<section aria-labelledby="how">
<h2 id="how">How the Batch Works</h2>
<p>Client code starts a batch session, adds calls, and awaits once. Under the hood, Cap’n Web sends one HTTP request carrying all calls, and the server executes them (with pipelining support).</p>
        
```
import { newHttpBatchRpcSession } from "capnweb";

const api = newHttpBatchRpcSession("/api");

// Queue calls without awaiting yet
const a = api.a();
const b = api.b();
const c = api.c();
const d = api.d();
const e = api.e();
const f = api.f();

// Send once, await once
const results = await Promise.all([a, b, c, d, e, f]);
```

<p>In a batch, you can even use <code>RpcPromise</code>s as parameters to other calls (promise pipelining). That lets you express dependent operations without additional round trips.</p>
</section>

<section aria-labelledby="worker">
<h2 id="worker">Minimal Worker Behind the Demo</h2>
<p>The Worker exposes two shapes:</p>
<ul>
<li><code>/rest/1</code>…<code>/rest/6</code>: one JSON response per request (sequential path in the demo).</li>
<li><code>/api</code>: Cap’n Web endpoint with six methods (<code>a</code>…<code>f</code>) served in one batch.</li>
</ul>
        
```
import { RpcTarget, newWorkersRpcResponse } from "capnweb";

class DemoApi extends RpcTarget {
constructor(delayMs) { super(); this.delayMs = delayMs; }
async a() { await wait(this.delayMs); return { step: "a", at: Date.now() }; }
async b() { await wait(this.delayMs); return { step: "b", at: Date.now() }; }
async c() { await wait(this.delayMs); return { step: "c", at: Date.now() }; }
async d() { await wait(this.delayMs); return { step: "d", at: Date.now() }; }
async e() { await wait(this.delayMs); return { step: "e", at: Date.now() }; }
async f() { await wait(this.delayMs); return { step: "f", at: Date.now() }; }
}
```

<p>Both paths set <code>Access-Control-Allow-Origin: *</code> and <code>Timing-Allow-Origin: *</code> so the demo page can measure times with the Performance API.</p>
</section>

<section aria-labelledby="results">
<h2 id="results">Expected Results</h2>
<p>If RTT is ~120&nbsp;ms and each call does ~120&nbsp;ms of work:</p>
<ul>
<li><strong>6 sequential REST calls:</strong> ~6 × (RTT + work) ≈ ~1440&nbsp;ms</li>
<li><strong>1 batch (6 calls):</strong> ~1 × (RTT + work) ≈ ~240&nbsp;ms</li>
</ul>
<p>Parallel REST improves over sequential, but still pays multiple RTTs and adds head‑of‑line blocking. The batch sends once.</p>
</section>

<section aria-labelledby="tradeoffs">
<h2 id="tradeoffs">Trade‑offs and When to Use It</h2>
<ul>
<li><strong>Great for:</strong> page boot, dashboards, “fan‑out” reads, and chained calls (authenticate → me → greet).</li>
<li><strong>Consider WebSocket:</strong> for sustained interactions or server‑initiated callbacks.</li>
<li><strong>Error handling:</strong> await all promises you care about; un‑awaited calls won’t return results in the batch.</li>
<li><strong>Security:</strong> capability‑based design reduces token sprawl and scopes authority to the object you hold.</li>
</ul>
</section>

<section aria-labelledby="try">
<h2 id="try">Try It Yourself</h2>
<ol>
<li>Open the <a href="../capnweb-batch-demo.html" rel="bookmark">live demo</a>.</li>
<li>Run the left (REST) and right (batch) buttons and compare request counts and total time.</li>
<li>Adjust the delay to simulate heavier endpoints or slower networks.</li>
</ol>
<p>To build your own, see Cloudflare’s post: <a href="https://blog.cloudflare.com/capnweb-javascript-rpc-library/" rel="external noopener noreferrer">Cap’n Web: a new JavaScript RPC library</a>.</p>
</section>
