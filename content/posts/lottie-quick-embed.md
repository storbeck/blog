---
title: "Simple Drop-in Animations"
description: "Drop‑in animations with Lottie web components. Designers export Lottie; developers embed a local .lottie or JSON with one tag—no JavaScript to write or CSS transforms to rebuild."
date: "2025-10-15"
category: "UI"
legacyUrl: "/posts/2025-10-15-lottie-quick-embed.html"
---

<section aria-labelledby="demo">
<h2 id="demo">Live demo</h2>
<p>This is a Lottie animation added with a single HTML tag. No custom JavaScript or CSS animations required.</p>
<figure>
<dotlottie-player
src="/lottie/bouncing_square.lottie"
background="transparent"
speed="1"
loop
autoplay
aria-label="Bouncing square animation"
style="width: 480px; height: 480px">
</dotlottie-player>
<figcaption><small>Embedded with the DotLottie web player. Local <code>.lottie</code> asset, looping and autoplay enabled.</small></figcaption>
</figure>
</section>

<section aria-labelledby="why">
<h2 id="why">Why use Lottie?</h2>
<p>Lottie is a lightweight, vector‑based animation format (JSON or <code>.lottie</code>) that plays natively on the web and mobile. Designers export straight from After Effects/Figma; developers embed the file with a single tag. You get sharp animations at any size, small downloads, and simple controls&mdash;without hand‑coding animation logic.</p>
</section>

<section aria-labelledby="whatyouneed">
<h2 id="whatyouneed">What you need</h2>
<ul>
<li>A Lottie file from <a href="https://lottiefiles.com/">https://lottiefiles.com/</a> (<code>.lottie</code> or JSON)</li>
<li>Permission to edit the page’s HTML</li>
</ul>
</section>

<section aria-labelledby="how">
<h2 id="how">Add an animation in two steps</h2>
<ol>
<li>Upload the Lottie file to your site. Example path: <code>/lottie/bouncing_square.lottie</code>.</li>
<li>Paste these two snippets into your page (anywhere inside <code>&lt;head&gt;</code> and where you want it to appear):</li>
</ol>
<p><strong>In the &lt;head&gt;:</strong></p>
        
```
<script type="module" src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"></script>
```

<p><strong>Where the animation should appear:</strong></p>
        
```
<dotlottie-player
  src="/lottie/bouncing_square.lottie"
  background="transparent"
  loop
  autoplay
  style="width: 480px; height: 480px">
</dotlottie-player>
```

<p>That’s it. You can change the size by editing the width/height numbers.</p>
</section>

<section aria-labelledby="options">
<h2 id="options">Optional settings</h2>
<ul>
<li><strong>Show controls</strong> (play/pause/seek): add <code>controls</code></li>
<li><strong>Reduce motion</strong>: remove <code>autoplay</code> so it only plays when clicked</li>
<li><strong>Use JSON instead of .lottie</strong>: swap the script + tag to the LottieFiles player:
            
```
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
<lottie-player src="/path/your.json" background="transparent" loop autoplay></lottie-player>
```

</li>
</ul>
</section>

<section aria-labelledby="tips">
<h2 id="tips">Tips</h2>
<ul>
<li>Prefer optimized assets (<em>Optimized Lottie JSON</em> or <em>.lottie</em>) to keep downloads small.</li>
<li>Size the animation by changing the inline width/height.</li>
<li>If you can’t include third‑party scripts, convert the Lottie to a video or GIF and use a normal <code>&lt;video&gt;</code> or <code>&lt;img&gt;</code>.</li>
<li>Designers keep control of the motion; developers avoid hand‑coding animations.</li>
</ul>
</section>
