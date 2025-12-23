---
title: "A Tiny MCP To Track App Store Feedback"
description: "Keep a free, daily pulse on customers by pulling App Store reviews into an AI‑enabled loop and fixing low‑hanging issues fast. Includes a tiny tool shape you can copy."
date: "2025-10-27"
category: "Developer Tools"
legacyUrl: "/posts/2025-10-27-creating-appstore-mcp-server.html"
---

<p><strong>Customer reviews are a free way to stay close to reality.</strong> Instead of skimming once a quarter, pull them every day, separate what’s working from what needs attention, and fix the easy stuff fast. A tiny MCP tool helps you do that in minutes.</p>

<section>
<h2>A Free Pulse</h2>
<p>The App Store provides a steady stream of unfiltered feedback. It costs nothing and shows patterns before dashboards do. The only cost is your time, so make it cheap: fetch the latest reviews on demand and let your assistant sort them into two piles you can act on today.</p>
</section>

<section>
<h2>A Simple Daily Loop</h2>
<p>Pull the latest reviews and let an assistant sort them into what’s working and what needs attention. In a minute you have a clear picture of where things stand.</p>
<p>Run it ad‑hoc or automate it with a scheduler like cron. Headless runs can post summaries in chat, open tickets, or drop drafts in your repo. If you’re comfortable with AI‑written code, you can gate a bot to propose small changes behind human review.</p>
</section>

<section>
<h2>Close the Loop</h2>
<p>When you address an issue, note it in release notes and reply to a few recent reviews that raised it. The tone matters. Your assistant can draft polite replies based on the latest summary so you stay consistent without sounding robotic.</p>
</section>

<section>
<h2>Make It Tiny</h2>
<p>You do not need a platform or a dashboard. A lightweight MCP tool that takes an app ID and returns two lists is enough. Keep the output predictable so the summaries stay sharp:</p>
                
```
{
"name": "feedback_summary",
"args": { "appId": "1420058690", "country": "us" },
"result": {
"totalFetched": 49,
"working_well": [ { "text": "Relaxing…", "rating": 5 } ],
"needs_fixing": [ { "text": "Ads too long…", "rating": 2 } ]
}
}
```

<p>If you prefer a starting point, there is a minimal example here you can adapt to any source: <a href="https://github.com/storbeck/ios_appstore_mcp/" rel="external noopener noreferrer">github.com/storbeck/ios_appstore_mcp</a>.</p>
</section>

<section>
<h2>Install and Use the App Store MCP</h2>
<p>This is a small server you can use to pull iOS reviews. Run it locally and wire it into an MCP‑enabled client.</p>
<h3>Prerequisites</h3>
<p>Node.js 18+ (20+ recommended) and npm.</p>
<h3>Install</h3>
                
```
git clone https://github.com/storbeck/ios_appstore_mcp.git ~/projects/ios_appstore_mcp
cd ~/projects/ios_appstore_mcp
npm install
npm run build
```

<h3>Use with Codex</h3>
<p>Add the server to Codex’s MCP config, then call the tool.</p>
                
```
# codex config (TOML)
[mcp_servers.appstore_reviews]
command = "node"
args = ["/absolute/path/to/ios_appstore_mcp/dist/server.js"]

# in a Codex chat
Call tool appstore_reviews_summary with: {"appId":"1420058690","country":"us","maxPages":3}
```

<p>To get the absolute path, run: <code>realpath ~/projects/ios_appstore_mcp/dist/server.js</code> and paste the result into the config.</p>
<h3>Use with Claude Desktop</h3>
<p>Register the same command as an MCP server in Claude’s settings. Then ask Claude to run the tool with your app ID.</p>
                
```
Call tool appstore_reviews_summary with: {"appId":"1420058690","country":"us","maxPages":3}
```

<p>Tip: start with one or two pages to keep responses fast, then expand when you need depth.</p>
</section>

<section>
<h2>Questions To Ask</h2>
<p>Here are a few prompts that cover most needs. They are plain and quick to run:</p>
<p><strong>Quick readout</strong>: “Fetch the latest reviews and summarize what’s working well vs what needs fixing.”</p>
<p><strong>Issues with quotes</strong>: “Show the top three recurring issues from the last 30 days with example quotes.”</p>
<p><strong>Momentum check</strong>: “Compare this week to last week and flag any regressions.”</p>
<p><strong>Plan the next sprint</strong>: “Propose the next three improvements with one user quote for each.”</p>
</section>

<section>
<h2>Output Examples</h2>
<h3>Quick readout: wins vs fixes</h3>
                
```
Fetched 49 recent US reviews. Working well: 44. Needs fixing: 5.

Working well
- Relaxing, used daily to unwind; helpful before bed or during recovery
- Art quality and variety; frequent new content and categories
- Satisfying completion moment that keeps engagement high
- Stability: some users say the app is “back to working”

Needs fixing
- Ads feel too frequent/long; interruptions mid‑flow; want persistent mute
- Background audio stops on open; request simultaneous playback
- Sync/restore reliability and slow support follow‑up
- Requests for filters/categories and specific themes (butterflies, famous art)
- Tiny pieces are hard to find; better hints/zoom would help
```


<h3>If you ask for 100 but fewer exist</h3>
<p>The tool is honest about limits. It summarizes what’s available and calls out the gap.</p>
                
```
Requested 100; only 49 recent reviews available.
Summary reflects these 49: 44 positive, 5 critical/mixed.
Themes match the quick readout above.
```


<h3>Top three recurring issues (last 30 days)</h3>
<p>Representative quotes help decide what to fix next and how to phrase release notes.</p>
<ul>
<li>Ads: too frequent/long; interruptive; hard to mute
<blockquote>
<p>“Long and repetitive ads after every single one…”</p>
<cite>— Mom5211</cite>
</blockquote>
</li>
<li>Content controls and preferences
<blockquote>
<p>“Add a new category… world famous artists like Monet, Van Gogh, O’Keefe…”</p>
<cite>— Ladybirdsong</cite>
</blockquote>
</li>
<li>Sync/restore reliability and support responsiveness
<blockquote>
<p>“Got a new iPad… all other apps synced… except this one. Lost years of work.”</p>
<cite>— Bonsai P</cite>
</blockquote>
</li>
</ul>

<h3>Week‑over‑week comparison</h3>
<p>When history is shallow, the tool says so and still gives you something useful to watch.</p>
                
```
Last week vs this week
- Depth: sample covers Oct 22–25 only; true WoW is limited
- Likely regressions to watch: ad annoyance, background audio interruption, restore reliability
- Positives hold: relaxation value, art quality, satisfying completion
```

</section>

<section>
<h2>Start Today</h2>
<p>Pick one product. Pull this week’s reviews. Let your assistant bucket them. Choose one obvious fix and one small quality‑of‑life improvement. Ship, reply, and do it again tomorrow. The habit is the win.</p>
</section>
