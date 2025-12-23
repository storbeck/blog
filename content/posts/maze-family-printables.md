---
title: "Maze Night With The Kids"
description: "Printable maze generator notes: Hunt-and-Kill in Go with ready-made PNG downloads."
date: "2025-11-10"
category: "Family Projects, Go"
legacyUrl: "/posts/2025-11-10-maze-family-printables.html"
---

<p>My son loves mazes. We have plenty of maze books (they’re great!), but sometimes he wants something easier, or he wants to solve it with me right on the computer. So I wrote a Go command that spits out a fresh PNG whenever he asks for one. It uses the Hunt-and-Kill algorithm, takes width/height/cell-size flags, and saves the file locally so we can trace it on the MacBook or print it for crayons.</p>

<p>The repo is tiny, open source, and easy to tweak if you want different colors or presets:</p>
<p>→ <a href="https://github.com/storbeck/maze" rel="noopener">github.com/storbeck/maze</a></p>

<section>
<h2>Quick example</h2>
        
```
make build
./bin/mazeimg             # default 20×20 cells
./bin/mazeimg -letter     # fills most of letter paper
./bin/mazeimg -letter -width 10 -height 10
```

<p>Half the fun is tinkering with the numbers together. He gets to see how changing width/height affects the output, and we talk a bit about how the generator wanders around to carve paths.</p>
</section>

<section>
<h2>Download a few of ours</h2>
<p>If you just want to print something, here are three PNGs pulled straight from our stash.</p>
<div class="download-grid" role="list">
<figure role="listitem">
<a href="/images/mazes/maze-easy.png" download>
<img src="/images/mazes/maze-easy.png" alt="Easy maze with 18 by 24 cells" width="360" height="360" loading="lazy" decoding="async">
</a>
<figcaption><strong>Easy Breezy</strong> — 18×24 cells @ 18 px.</figcaption>
</figure>
<figure role="listitem">
<a href="/images/mazes/maze-letter.png" download>
<img src="/images/mazes/maze-letter.png" alt="Letter-sized maze with moderate density" width="360" height="360" loading="lazy" decoding="async">
</a>
<figcaption><strong>Letter Duel</strong> — 60×75 cells auto-scaled with <code>-letter</code>.</figcaption>
</figure>
<figure role="listitem">
<a href="/images/mazes/maze-mega.png" download>
<img src="/images/mazes/maze-mega.png" alt="Ultra-dense maze with 120 by 140 cells" width="360" height="360" loading="lazy" decoding="async">
</a>
<figcaption><strong>Mega Marathon</strong> — 120×140 cells, bring patience.</figcaption>
</figure>
</div>
</section>
