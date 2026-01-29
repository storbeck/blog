---
title: "YTPod: An iPod‑style YouTube player"
description: "A tiny desktop player inspired by RyOS and built to search YouTube and play via an embedded iframe, with a modern music-player feel."
date: "2026-01-29"
category: "Projects"
legacyUrl: "/posts/2026-01-29-ytpod-ipod-player.html"
---

<section itemprop="articleBody">
<video controls autoplay muted loop playsinline preload="auto" width="260" style="max-width:100%; border-radius:10px; float:right; margin:4px 0 12px 16px; object-fit:cover; background:#fff; display:block;">
  <source src="/videos/ytpod.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
<p>I watched <a href="https://www.youtube.com/watch?v=TQhv6Wol6Ns">Ryo Lu&rsquo;s RyOS demo</a> and the tiny iPod player he built inside that online OS. His version plays local music. I just thought it was a cool project and wanted to build my own with a slightly different purpose.</p>

<p>That idea turned into YTPod: a desktop player that looks like an iPod, connects to YouTube for search and playlists, and plays audio through the official iframe player.</p>

<p>I vibe coded the first version in about an hour using Cursor, ran out of free credits, then finished it in Codex. Codex ended up being the cheaper option and it works well enough for me. It was genuinely fun to build as a personal experiment.</p>

<p>It&rsquo;s a good reminder that small apps are worth building even when they aren&rsquo;t monetized or part of a startup plan. Having an idea and seeing it running an hour later is still one of the best feelings in software.</p>




<div style="clear:both;"></div>
</section>



<section>
<h2>How it works</h2>

<p>YTPod uses the YouTube Data API v3 for search and playlist fetches, then plays the audio through the YouTube iframe player. The API key is only for the data calls, so playback happens through the official embed.</p>

<p>There&rsquo;s no service layer or API on my side right now. It&rsquo;s just a standalone client that searches and plays YouTube content. In practice, it even seems to surface fewer ads than a normal YouTube session, which has been a nice surprise.</p>

<p>The app stores your key locally so you only paste it once. After that, it behaves like a compact music player: pick a preset, paste a playlist, or type a search and go.</p>
</section>

<section>
<h2>Links</h2>

<p>Project repo: <a href="https://github.com/storbeck/ytpod">https://github.com/storbeck/ytpod</a></p>
<p>Download: <a href="https://github.com/storbeck/ytpod/releases/download/1.0.0/YTPod-1.0.0-arm64.dmg"> macOS installer (DMG)</a></p>
</section>

