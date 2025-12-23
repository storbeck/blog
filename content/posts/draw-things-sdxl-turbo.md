---
title: "Quick n' Dirty AI Image Generation"
description: "AI image generation without paid tools: a three-step Draw Things + SDXL Turbo recipe that runs locally for faster idea sketching."
date: "2025-11-08"
category: "Generative Art, Workflow"
legacyUrl: "/posts/2025-11-08-draw-things-sdxl-turbo.html"
---

<p>AI image generation doesn’t need a paid cloud tool. SDXL Turbo plus Draw Things on an M5 MacBook Pro runs everything locally, so there’s no subscription meter—just a quick model download and fast storage. With 3 inference steps and the <strong>Euler A (Substep)</strong> sampler, I can turn a scribbled idea into a publishable render before Finder can finish syncing screenshots.</p>

<section>
<h2>The three steps</h2>
<ol>
<li><strong>Load SDXL Turbo</strong>: Select the built-in <em>SDXL Turbo</em> checkpoint in Draw Things and keep <em>CFG</em> near 4, nudging up or down depending on how literal you want the prompt to be.</li>
<li><strong>Set Euler A Substep</strong>: In Sampler settings choose <em>Euler A (Substep)</em> and set <em>Step Count</em> to exactly <strong>3</strong>. Going past five steps makes Turbo get oily and over-baked, so I keep it between two and five.</li>
<li><strong>Prompt, queue, publish</strong>: Drop in a reference idea, spin up a couple of seeds, and export the keepers so you can post or iterate immediately.</li>
</ol>
<p>No loras, no ControlNet, and no extra passes—the point is to stay within three steps so ideation never stalls.</p>
</section>

<section>
<h2>Sample outputs</h2>
<p>The gallery below shows every render from tonight’s session—kaiju fluff studies, Siamese lighting tests, a crab spirit, and the animorph experiment. Each set shares prompts but diverges only by seed so I can compare composition side by side.</p>

<section class="figure-row" aria-label="Fluffy Godzilla variations">
<figure>
<picture>
<source type="image/webp" srcset="/images/sdxl-fluffy-godzilla-1-400w.webp 400w, /images/sdxl-fluffy-godzilla-1-800w.webp 800w, /images/sdxl-fluffy-godzilla-1-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/sdxl-fluffy-godzilla-1-400w.jpg 400w, /images/sdxl-fluffy-godzilla-1-800w.jpg 800w, /images/sdxl-fluffy-godzilla-1-1200w.jpg 1200w">
<img src="/images/sdxl-fluffy-godzilla-1-800w.jpg" alt="Fluffy Godzilla-style creature roaring on a neon-lit street." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>Seed 42: softer rim light, same 3-step recipe.</figcaption>
</figure>
<figure>
<picture>
<source type="image/webp" srcset="/images/sdxl-fluffy-godzilla-2-400w.webp 400w, /images/sdxl-fluffy-godzilla-2-800w.webp 800w, /images/sdxl-fluffy-godzilla-2-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/sdxl-fluffy-godzilla-2-400w.jpg 400w, /images/sdxl-fluffy-godzilla-2-800w.jpg 800w, /images/sdxl-fluffy-godzilla-2-1200w.jpg 1200w">
<img src="/images/sdxl-fluffy-godzilla-2-800w.jpg" alt="Second fluffy Godzilla render with a warmer palette and smoke trails." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>Seed 128 flips the palette to warmer sodium lights.</figcaption>
</figure>
</section>
<section class="figure-row" aria-label="Siamese cat lighting studies">
<figure>
<picture>
<source type="image/webp" srcset="/images/sdxl-siamese-cat-1-400w.webp 400w, /images/sdxl-siamese-cat-1-800w.webp 800w, /images/sdxl-siamese-cat-1-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/sdxl-siamese-cat-1-400w.jpg 400w, /images/sdxl-siamese-cat-1-800w.jpg 800w, /images/sdxl-siamese-cat-1-1200w.jpg 1200w">
<img src="/images/sdxl-siamese-cat-1-800w.jpg" alt="Portrait of a Siamese cat with blue rim lighting and shallow depth of field." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>Seed 77 leans into teal rim light and cinematic grain.</figcaption>
</figure>
<figure>
<picture>
<source type="image/webp" srcset="/images/sdxl-siamese-cat-2-400w.webp 400w, /images/sdxl-siamese-cat-2-800w.webp 800w, /images/sdxl-siamese-cat-2-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/sdxl-siamese-cat-2-400w.jpg 400w, /images/sdxl-siamese-cat-2-800w.jpg 800w, /images/sdxl-siamese-cat-2-1200w.jpg 1200w">
<img src="/images/sdxl-siamese-cat-2-800w.jpg" alt="Siamese cat study with warmer studio lighting and sharp whisker detail." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>Seed 93 warms things up without changing the step count.</figcaption>
</figure>
</section>

<section class="figure-row" aria-label="Hybrid creature and seasonal study">
<figure>
<picture>
<source type="image/webp" srcset="/images/sdxl-animorph-cat-dog-400w.webp 400w, /images/sdxl-animorph-cat-dog-800w.webp 800w, /images/sdxl-animorph-cat-dog-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/sdxl-animorph-cat-dog-400w.jpg 400w, /images/sdxl-animorph-cat-dog-800w.jpg 800w, /images/sdxl-animorph-cat-dog-1200w.jpg 1200w">
<img src="/images/sdxl-animorph-cat-dog-800w.jpg" alt="SDXL Turbo render of a half-cat, half-dog creature with studio lighting and intricate fur detail." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>Animorph mash-up stayed crispy even with a single CFG tweak.</figcaption>
</figure>
<figure>
<picture>
<source type="image/webp" srcset="/images/sdxl-halloween-crab-400w.webp 400w, /images/sdxl-halloween-crab-800w.webp 800w, /images/sdxl-halloween-crab-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/sdxl-halloween-crab-400w.jpg 400w, /images/sdxl-halloween-crab-800w.jpg 800w, /images/sdxl-halloween-crab-1200w.jpg 1200w">
<img src="/images/sdxl-halloween-crab-800w.jpg" alt="Hyper-real Halloween crab with glowing lantern eyes and moody studio fog." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>The crab only needed a negative prompt for blown highlights.</figcaption>
</figure>
</section>

<section class="figure-row" aria-label="Atlantica character paintovers">
<figure>
<picture>
<source type="image/webp" srcset="/images/draw-things-flounder-400w.webp 400w, /images/draw-things-flounder-800w.webp 800w, /images/draw-things-flounder-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/draw-things-flounder-400w.jpg 400w, /images/draw-things-flounder-800w.jpg 800w, /images/draw-things-flounder-1200w.jpg 1200w">
<img src="/images/draw-things-flounder-800w.jpg" alt="Bright, stylized portrait of Flounder smiling against a coral reef background." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>Juggernaut XL V9 can give great results also.</figcaption>
</figure>
<figure>
<picture>
<source type="image/webp" srcset="/images/draw-things-mermaid-400w.webp 400w, /images/draw-things-mermaid-800w.webp 800w, /images/draw-things-mermaid-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/draw-things-mermaid-400w.jpg 400w, /images/draw-things-mermaid-800w.jpg 800w, /images/draw-things-mermaid-1200w.jpg 1200w">
<img src="/images/draw-things-mermaid-800w.jpg" alt="Mermaid heroine with flowing red hair and bioluminescent accents looking toward the surface." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>It does great at pearlescent fins and balanced skin tones.</figcaption>
</figure>
<figure>
<picture>
<source type="image/webp" srcset="/images/draw-things-king-triton-400w.webp 400w, /images/draw-things-king-triton-800w.webp 800w, /images/draw-things-king-triton-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/draw-things-king-triton-400w.jpg 400w, /images/draw-things-king-triton-800w.jpg 800w, /images/draw-things-king-triton-1200w.jpg 1200w">
<img src="/images/draw-things-king-triton-800w.jpg" alt="Regal King Triton concept with glowing trident lighting his armor and flowing beard." width="512" height="512" loading="lazy" decoding="async">
</picture>
<figcaption>It just takes a bit longer to render than SDXL Turbo, but it can give you a Pixar-like finish.</figcaption>
</figure>
</section>
</section>
<section aria-label="Reference workflow from SDXL Turbo to Juggernaut">
<h3>From quick picks to polish</h3>
<p>Once I have a keeper from SDXL Turbo, I feed that render back in as the reference image and flip the model selector to Juggernaut XL V9. Turbo hands me options in two to five seconds, while Juggernaut takes closer to forty seconds but pays it off with richer fabrics, skin, and lighting.</p>
<figure>
<picture>
<source type="image/webp" srcset="/images/draw-things-family-workflow-400w.webp 400w, /images/draw-things-family-workflow-800w.webp 800w, /images/draw-things-family-workflow-1200w.webp 1200w">
<source type="image/jpeg" srcset="/images/draw-things-family-workflow-400w.jpg 400w, /images/draw-things-family-workflow-800w.jpg 800w, /images/draw-things-family-workflow-1200w.jpg 1200w">
<img src="/images/draw-things-family-workflow-1200w.jpg" alt="Screenshot of Draw Things showing a Civil War era family render with the Juggernaut XL V9 model selected and a strip of SDXL Turbo iterations on the right." width="1200" height="682" loading="lazy" decoding="async">
</picture>
<figcaption>Iterate fast with SDXL Turbo (thumbnails on the right), lock the keeper, then rerender it with Juggernaut XL V9 for the hero shot.</figcaption>
</figure>
<p>This is not a replacement for real photographers or illustrators—it is just a DIY path for mock images when budget is tight or you need placeholder art you can spin up yourself, assuming your hardware can run the models.</p>
</section>

<section>
<h2>Video capture for context</h2>
<p>The workflow is light enough that I can screen record concept passes while Turbo renders in the background.</p>
<figure>
<video src="/videos/sushi_game_art.mp4" width="1511" height="861" controls muted loop playsinline preload="metadata" aria-label="Screen recording of creating sushi mobile game art assets in Draw Things."></video>
<figcaption>Real-time capture while generating sushi mobile game tiles; rendering stayed under two seconds per frame.</figcaption>
</figure>
<figure>
<video src="/videos/surf_board.mp4" width="1511" height="861" controls muted loop playsinline preload="metadata" aria-label="Video walkthrough brainstorming a surf board shop landing page idea."></video>
<figcaption>Quick surf board shop landing page ideation—the same presets apply, just swap the prompt context.</figcaption>
</figure>
</section>

<section>
<h2>Why this matters</h2>
<p>Because everything runs on-device, I can prototype without internet, keep client prompts private, and avoid the latency of cloud inference. SDXL Turbo loves short step counts, so pairing it with a disciplined three-step recipe keeps ideation nimble. I have stopped bouncing to paid assistants unless I need help writing copy—visual ideas live entirely inside Draw Things.</p>
</section>
