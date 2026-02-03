---
title: "Supply Chain Graph from package-lock.json (LadybugDB)"
description: "A compact experiment loading an npm lockfile into LadybugDB for dependency analysis and visualization."
date: "2026-02-03"
category: "Engineering"
legacyUrl: "/posts/2026-2-3-ladybugdb-supply-chain-graph.html"
---

<section>
<p>Embedded graph databases let you query graph-structured data without running a server, managing ports, or dealing with much configuration. They run as a single binary and store the database in one file on disk. That makes them ideal for local analysis, air-gapped environments, or any situation where you want a self-contained tool you can spin up quickly.</p>
<p><a href="https://ladybugdb.com/">LadybugDB</a>, a recently introduced embedded graph database, was used in this experiment to load and explore the dependency graph from a Node.js <code>package-lock.json</code> file.</p>
</section>

<section>
<h3>Background on LadybugDB</h3>
<p>LadybugDB continues development from the <a href="https://kuzudb.github.io/">KuzuDB</a> codebase. KuzuDB, an MIT-licensed open-source embedded graph database, was first released in November 2022 based on research from the University of Waterloo, Canada. It was maintained by Kùzu Inc. (Toronto) and offered features including full-text search, vector indexes, parallel query execution, and WebAssembly support for browser-based usage.</p>
<p>In October 2025, Kùzu Inc. archived the main KuzuDB GitHub repository and stated that “Kuzu is working on something new.” The project website’s documentation and blog posts were moved to GitHub.</p>
<p>Following the archiving:</p>
<ul>
<li>Kineviz created a fork named <a href="https://github.com/Kineviz/bighorn">Bighorn</a> and invited community participation to maintain and evolve the codebase.</li>
<li>Arun Sharma announced LadybugDB as the next step forward, describing it as an effort to build “the DuckDB for graphs.” Sharma serves as project lead, focusing on development and lakehouse-style architecture. He has prior experience contributing to the Linux kernel and working in infrastructure engineering.</li>
</ul>
<p>LadybugDB’s stated early priorities are:</p>
<ul>
<li>Stabilizing the codebase and storage engine</li>
<li>Fixing bugs, with immediate attention to any security-related issues</li>
<li>Adding lakehouse capabilities, including the ability to create tables directly over object storage without a separate ingestion step</li>
</ul>
<p>Sharma has emphasized transparent governance and community involvement. Early investor interest has been reported to support faster development and long-term sustainability.</p>
<p>The graph visualization and client tool <a href="https://gdotv.com/"><a href="https://gdotv.com/">G.V()</a></a> already provides support for LadybugDB (building directly on its prior KuzuDB integration) and was used to visualize and explore the loaded graph in this experiment.</p>
</section>

<section>
<h3>Experiment: Loading a package-lock.json</h3>
<p>A <code>package-lock.json</code> file (v2 or v3 format) was chosen because it contains a complete, resolved dependency tree — often thousands of packages deep — that is frequently examined during vulnerability investigations or supply-chain reviews.</p>
<p>A short <a href="https://github.com/storbeck/supply-chain-graph/blob/main/lockfile_to_ladybug.py">Python script</a> parses the lockfile and generates:</p>
<ul>
<li><code>packages.csv</code> — node data</li>
<li><code>depends.csv</code> — edge data</li>
<li><code>load.sql</code> — schema creation and <code>COPY</code> statements</li>
</ul>
<p><a href="https://docs.ladybugdb.com/installation/">Installing LadybugDB is straightforward</a>.</p>

```bash
brew install ladybug
```

<p>To create a database, you can just run:</p>

```bash
lbug dbname.bug
```

<p>From there, you can run the generated <code>load.sql</code> file to create tables and import CSVs. The graph loads in seconds for typical application lockfiles.</p>
</section>

<section>
<h3>Schema</h3>

```cypher
CREATE NODE TABLE Package(
    path        STRING PRIMARY KEY,
    name        STRING,
    version     STRING,
    is_dev      BOOL,
    is_optional BOOL,
    is_peer     BOOL,
    integrity   STRING,
    resolved    STRING
);

CREATE REL TABLE DEPENDS_ON(
    FROM Package TO Package,
    dep_type    STRING,
    is_optional BOOL,
    is_dev      BOOL,
    is_peer     BOOL
);
```

<ul>
<li><code>path</code> — lockfile package key (used as primary key)</li>
<li>Booleans (<code>is_dev</code>, <code>is_optional</code>, <code>is_peer</code>) preserve dependency category information</li>
<li><code>integrity</code> and <code>resolved</code> retain hash and resolution metadata</li>
</ul>
</section>

<section>
<h3>What This Looks Like</h3>

<p>The full dependency graph is dense, but even at a glance it shows hubs and hotspots where risk clusters. <a href="https://gdotv.com/">G.V()</a> makes it easy to pan, filter, and explore the shape of the graph without losing context.</p>

<img src="/images/ladybug-top-dep-hubs.png" alt="LadybugDB graph view showing a dense dependency network with Package nodes and DEPENDS_ON edges." loading="lazy" decoding="async" />

<p>For triage, it helps to answer simple questions fast: do we have a package, where does it appear, and what might be impacted?</p>

<img src="/images/ladybug-do-we-have-version.png" alt="Query results for a specific package showing path, version, and resolved fields." loading="lazy" decoding="async" />

<img src="/images/ladybug-whats-impacted.png" alt="Query results listing impacted packages that depend on a compromised package." loading="lazy" decoding="async" />

<img src="/images/ladybug-find-parents.png" alt="Direct dependency parents for a compromised package, including edge metadata (dev/optional/peer)." loading="lazy" decoding="async" />

<img src="/images/ladybug-dependency-path.png" alt="Graph path results showing the dependency chain from the root package to a target package." loading="lazy" decoding="async" />
</section>

<section>
<h3>Key Takeaways from the Experiment</h3>
<ul>
<li>Variable-length path patterns require a practical upper bound to avoid performance degradation.</li>
<li>CSV import is fast and straightforward, enabling rapid iteration.</li>
<li>At the scale of a typical <code>package-lock.json</code> (thousands of nodes/edges), query performance remains excellent.</li>
<li><a href="https://gdotv.com/">G.V()</a> provides immediate visualization and exploration capabilities for LadybugDB-loaded graphs.</li>
</ul>
<p>This approach complements (but does not replace) standard tools such as <code>npm ls</code>, <code>npm why</code>, OSV-Scanner, and Dependabot for routine dependency checks.</p>
</section>
