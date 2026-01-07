---
title: "Roblox Cache: RBXH, SQLite, and Offline Extraction"
description: "A practical map of RobloxPlayer's local cache: the SQLite index, the RBXH wrapper, CDN URLs, and how to trim payloads into viewable files."
date: "2026-01-07"
category: "Reverse Engineering"
legacyUrl: "/posts/2026-01-07-roblox-cache-rbxh-sqlite.html"
---

<p>RobloxPlayer maintains a two‑layer cache on macOS: a SQLite index at <code>~/Library/Roblox/rbx-storage.db</code> and a payload store under <code>$TMPDIR/Roblox/rbx-storage</code>. In a local snapshot, the index contained 96,104 rows totaling ~3.69&nbsp;GiB. Each payload file begins with an <code>RBXH</code> wrapper that stores the source CDN URL and a byte payload. The payloads are often valid assets but may include a small prefix before the real file header, so trimming to the first magic bytes is sometimes required.</p>

<section>
<h2>SQLite schema and what it means</h2>
<p>The schema is small and readable. To inspect it directly:</p>

```
sqlite3 ~/Library/Roblox/rbx-storage.db ".schema"
sqlite3 ~/Library/Roblox/rbx-storage.db "PRAGMA table_info(files);"
```

<p>The <code>files</code> table includes:</p>
<ul>
<li><strong>id (BLOB):</strong> 16-byte key that becomes the filename (hex-encoded).</li>
<li><strong>content (BLOB):</strong> small payloads are inlined here.</li>
<li><strong>size:</strong> payload size in bytes.</li>
<li><strong>hits:</strong> usage counter.</li>
<li><strong>atime:</strong> access time in epoch milliseconds.</li>
<li><strong>ttl:</strong> expiry in epoch seconds (0 means no TTL).</li>
</ul>

<p>Large payloads tend to have <code>content IS NULL</code> and live on disk. The DB acts as the index.</p>
<p>Observations from the local snapshot:</p>
<ul>
<li>The <code>id</code> is 16 bytes, matching the 32‑hex filenames on disk.</li>
<li><code>atime</code> values are epoch milliseconds.</li>
<li><code>ttl</code> values are epoch seconds; <code>ttl = 0</code> appears frequently.</li>
<li>Most bytes were in category 10, and most <code>ttl = 0</code> rows were in category 10.</li>
</ul>
</section>

<section>
<h2>Mapping DB IDs to files</h2>
<p>The on-disk filename is just the hex version of the 16-byte ID. The first two hex chars are the shard folder. This makes the mapping deterministic: any DB row can be resolved to a single cache path without guessing.</p>
</section>

<section>
<h2>What it’s for</h2>
<p>This is a straightforward local cache: it reduces network fetches, speeds up asset loads, and lets the client re-use content across sessions. The DB is the index and metadata layer; the temp folder is the bulk storage. The CDN URL stored in the header is a handy provenance tag, not a guarantee the URL is publicly accessible.</p>
</section>

<section>
<h2>How the cache gets populated</h2>
<p>The cache is generated opportunistically during play. When a session joins a place, the client logs the place and universe, then immediately begins fetching assets that world references. Those asset requests are what land in <code>rbx-storage</code> and get indexed in <code>rbx-storage.db</code>.</p>
<p>On macOS, the join context is visible in <code>~/Library/Logs/Roblox/*_Player_*_last.log</code>. A typical sequence shows a join with <code>placeId</code>, <code>universeId</code>, and server endpoint, followed by asset load lines. That temporal proximity is the practical link between a cache entry and a specific game session.</p>
<p>Example join context lines from the log:</p>

```
! Joining game '472478ed-6c7b-4acc-a0ef-3605cc510ebc' place 120274717380291 at 10.186.5.23
GameJoinLoadTime ... placeid:120274717380291 ... universeid:9306827644 ...
Connecting to UDMUX server 128.116.48.33:62658, and RCC server 10.186.5.23:62658
```
</section>

<section>
<h2>RBXH: the cache wrapper</h2>
<p>Every file I looked at starts with an <code>RBXH</code> header: a small wrapper that stores a version, the length of a URL, the URL itself, and then the payload. The version I saw was consistently <code>2</code>. The URL is usually a <code>rbxcdn.com</code> host (sometimes with a <code>tr.rbxcdn.com</code> transform path). Visiting those URLs directly often returns “Access Denied” unless the request includes Roblox’s headers and auth, which is why the local cache is still useful for offline analysis.</p>
</section>

<section>
<h2>Identifying payload types</h2>
<p>A hex dump makes it obvious where the wrapper ends and the asset begins. In this sample, the RBXH header is followed by a KTX 2.0 texture (the KTX magic starts with <code>AB 4B 54 58 20</code> and the KTX2 identifier <code>0D 0A 1A 0A</code> follows):</p>

```
xxd -g 1 -l 256 0093fd196e6523f1ac77c460fb972cd3

00000000: 52 42 58 48 02 00 00 00 36 00 00 00 68 74 74 70  RBXH....6...http
00000010: 73 3a 2f 2f 63 34 2e 72 62 78 63 64 6e 2e 63 6f  s://c4.rbxcdn.co
00000020: 6d 2f 36 64 30 66 64 62 32 36 39 30 66 34 38 64  m/6d0fdb2690f48d
00000030: 37 33 32 61 38 62 36 38 36 38 66 31 36 37 62 34  732a8b6868f167b4
00000040: 36 39 00 c8 00 00 00 00 00 00 00 00 00 00 00 9e  69..............
00000050: d2 11 00 95 84 de 67 03 00 00 00 ab 4b 54 58 20  ......g.....KTX 
00000060: 32 30 bb 0d 0a 1a 0a 89 00 00 00 01 00 00 00 00  20..............
00000070: 04 00 00 00 04 00 00 00 00 00 00 00 00 00 00 01  ................
00000080: 00 00 00 0b 00 00 00 02 00 00 00 58 01 00 00 3c  ...........X...<
00000090: 00 00 00 94 01 00 00 88 01 00 00 00 00 00 00 00  ................
000000a0: 00 00 00 00 00 00 00 00 00 00 00 b5 88 04 00 00  ................
000000b0: 00 00 00 e9 49 0d 00 00 00 00 00 00 00 10 00 00  ....I...........
000000c0: 00 00 00 ae 2a 01 00 00 00 00 00 07 5e 03 00 00  ....*.......^...
000000d0: 00 00 00 00 00 04 00 00 00 00 00 09 4f 00 00 00  ............O...
000000e0: 00 00 00 a5 db 00 00 00 00 00 00 00 00 01 00 00  ................
000000f0: 00 00 00 36 17 00 00 00 00 00 00 d3 37 00 00 00  ...6........7...
```
</section>

<section>
<h2>What the payloads are</h2>
<p>The payloads are the actual assets: images, audio, and various compressed or serialized blobs. In a small scan I saw PNG, WEBP, and OGG alongside zlib and gzip‑wrapped data. Some payloads are raw files. Others have a short prefix before the real file header.</p>
<p>Because the cache reflects assets already downloaded during play, you can extract locally cached images and audio for inspection without going back to the network.</p>

<figure>
<img src="/images/rbx-cache-handshake.png" alt="White handshake icon extracted from Roblox cache" width="512" height="512" loading="lazy" decoding="async">
<figcaption>Handshake icon pulled from the local cache.</figcaption>
</figure>

<figure>
<img src="/images/rbx-cache-trophy.png" alt="Gold trophy icon extracted from Roblox cache" width="512" height="512" loading="lazy" decoding="async">
<figcaption>Trophy icon pulled from the local cache.</figcaption>
</figure>

<figure>
<audio controls preload="none" src="/audio/rbx-cache-sample.ogg"></audio>
<figcaption>Cached OGG pulled from disk for inspection. Use extracted audio only within licensing constraints.</figcaption>
</figure>
</section>

<section>
<h2>Trimming the payload</h2>
<p>Every file in the cache starts with the <code>RBXH</code> wrapper. After you skip that wrapper, some payloads begin immediately with the asset header, while others include a short prefix before the real header. I hit an OGG file that needed a 25‑byte trim before it would play. The fix is mechanical: scan for a magic header (like <code>OggS</code> or <code>\x89PNG</code>) and write from that offset. Once trimmed, QuickTime and Preview open the files normally. The same approach works for PNG and WEBP.</p>
</section>

<section>
<h2>Repo</h2>
<p>I packaged the scanning and extraction into a small repo:</p>
<p>→ <a href="https://github.com/storbeck/rbx-cache-scan" rel="external noopener noreferrer">github.com/storbeck/rbx-cache-scan</a></p>
</section>

<section>
<h2>Related</h2>
<p>If you want more Roblox reverse engineering context, I also wrote: <a href="/posts/2025-10-09-ghidra-string-tracing.html" rel="bookmark">Tracing Roblox Purchase Prompt Functions</a>.</p>
</section>
