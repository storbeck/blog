---
title: "Browse the Tor Network with Claude (curl + socks5h)"
description: "Browse Tor with Claude using curl over socks5h: simple setup, fast lookups via Ahmia, and how to prompt Claude to find and skim .onion sites like a search engine."
date: "2025-10-16"
category: "Networking, Tools"
legacyUrl: "/posts/2025-10-16-tor-proxy-cli.html"
---

<section>
<h2>What you get</h2>
<p>Claude can “browse the Tor Network" by running <code>curl</code> through your local Tor proxy. Both DNS and HTTP(S) stay inside Tor, so <code>.onion</code> works. With Ahmia, Claude can act like a simple search engine for onions: find candidates, fetch headers, skim first lines, and report back fast.</p>
<ul>
<li>Proxy: <code>127.0.0.1:9050</code> (Tor SOCKS)</li>
<li>Mode: <code>socks5h</code> (Tor resolves hostnames)</li>
</ul>
</section>

      

<section>
<h2>Quick start (Fedora)</h2>
        
```
sudo dnf install tor
sudo systemctl enable --now tor
sudo ss -ltn | grep ':9050'   # expect 127.0.0.1:9050
```

</section>

<section>
<h2>Use with curl</h2>
<p>One‑off:</p>
        
```
curl --socks5-hostname 127.0.0.1:9050 http://exampleonion.onion/
```

<p>Or set an env var for the session:</p>
        
```
export ALL_PROXY=socks5h://127.0.0.1:9050
curl http://exampleonion.onion/
```

<p><strong>Important:</strong> use <code>socks5h</code> (or <code>--socks5-hostname</code>) so Tor does the DNS resolution. Plain <code>socks5</code> won’t resolve <code>.onion</code>.</p>
</section>

<section>
<h2>Verify it works</h2>
        
```
curl -sS --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip
# Expect: {"IsTor": true, ...}
```

</section>

<section>
<h2>Claude Code profile (copy‑paste)</h2>
<p>Drop this into your Claude project as <code>CLAUDE.md</code>. It tells Claude to use the Bash tool with <code>curl</code> over Tor and how to search/skim onions via Ahmia.</p>
        
```
# Claude Code: Tor browsing via curl (.onion ready)

Purpose
- Use curl through your local Tor SOCKS proxy from the Bash tool. Don't proxy Claude itself. WebFetch doesn't use SOCKS proxies, so it won't reach .onion. Using socks5h keeps DNS + HTTP inside Tor.

Assumptions
- Tor running locally with SOCKS on 127.0.0.1:9050
- Bash tool available in Claude Code

Rules
- Use Bash + curl instead of WebFetch for .onion
- Route curl via Tor:
- Per command: --socks5-hostname 127.0.0.1:9050
- Or session-wide: export ALL_PROXY=socks5h://127.0.0.1:9050
- Use -sS to show errors without the progress bar

Sanity check (clearnet via Tor)
curl -sS --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/api/ip
# Expect: {"IsTor": true, ...}

Ahmia basics
BASE='http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion'

1) Headers (reachability)
curl -sS -I --socks5-hostname 127.0.0.1:9050 "$BASE/"

2) Search and extract v3 onion candidates (dedup)
QUERY='marketplace'
curl -sS --socks5-hostname 127.0.0.1:9050 "$BASE/search/?q=${QUERY}" | \
grep -Eo 'https?://[a-z2-7]{56}\.onion' | sort -u | head -n 10

3) Probe one host, then fetch a snippet
HOST='EXAMPLE.onion'
curl -sS -I --socks5-hostname 127.0.0.1:9050 "http://$HOST/" | sed -n '1,12p'
curl -sS    --socks5-hostname 127.0.0.1:9050 "http://$HOST/" | head -n 20

Notes
- .onion needs DNS inside Tor (RFC 7686). curl must use socks5h: --socks5-hostname or ALL_PROXY=socks5h://...
- WebFetch won't use a SOCKS proxy; use Bash + curl
- Sites are intermittent; small timeouts and retries help
```

</section>

<section>
<h2>Ask Claude like a search engine</h2>
<p>Prompt Claude in plain English, it will run the Ahmia query via <code>curl</code> over Tor and list candidate onions:</p>
        
```
"find me academic research repository onions"

● Bash(QUERY='research+papers' curl -sS --socks5-hostname 127.0.0.1:9050 …)
⎿  2222f2ikw4c6x4sljqbtalrqz5ngfoizmw3uyvont3tqkehdpmtdayqd.onion
2gzyxa5i5ayvgbqn6r7r37fzapdf5fp6vxtxqymxoa6cocwemjgs5nyd.onion
2gzyxa5ihm7nsggfxnu52rck2vv4rvmdlkiu3zzui5du4xyclen53wid.onion
… +12 lines (ctrl+r to expand)

● Bash(QUERY='thesis+dissertation' curl -sS --socks5-hostname 127.0.0.1:9050 …)
⎿  Running…

● Bash(QUERY='digital+library' curl -sS --socks5-hostname 127.0.0.1:9050 …)
⎿  Waiting…
ctrl+b to run in background
```

<p>Under the hood, it’s just Ahmia plus a small filter for v3 onion hostnames:</p>
        
```
QUERY='research+papers'
BASE='http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion'
curl -sS --socks5-hostname 127.0.0.1:9050 "$BASE/search/?q=${QUERY}" | \
grep -Eo 'https?://[a-z2-7]{56}\.onion' | sort -u | head -n 20
```

<p>To skim content quickly, fetch headers or the first lines from each host:</p>
        
```
curl -sS -I --socks5-hostname 127.0.0.1:9050 http://EXAMPLE.onion/
curl -sS    --socks5-hostname 127.0.0.1:9050 http://EXAMPLE.onion/ | head -n 20
```

</section>

<section>
<h2>Troubleshooting</h2>
<ul>
<li>Tor not running: <code>systemctl status tor</code></li>
<li>No <code>.onion</code> resolution: curl needs <code>socks5h</code>; plain curl won't resolve <code>.onion</code> (RFC 7686). Use <code>--socks5-hostname</code> or <code>ALL_PROXY=socks5h://...</code>.</li>
<li>WebFetch: doesn't use a SOCKS proxy, so it won't reach <code>.onion</code>. Use Bash + <code>curl</code> with <code>socks5h</code>.</li>
</ul>
</section>

      
<section>
<h2>See also</h2>
<ul>
<li><a href="https://curl.se/docs/manpage.html" rel="external noopener noreferrer">curl manual</a></li>
<li><a href="https://community.torproject.org/" rel="external noopener noreferrer">Tor Project community</a></li>
<li><a href="https://www.rfc-editor.org/rfc/rfc7686" rel="external noopener noreferrer">RFC 7686: The .onion Special-Use Domain Name</a></li>
</ul>
</section>
