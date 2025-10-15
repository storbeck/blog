# Agent Guidelines for This Repository

These instructions apply to the entire repository. Follow them when creating or editing files. Keep changes minimal, focused, and strictly aligned with the blog’s philosophy: plain, fast, semantic HTML with no CSS or JavaScript frameworks.

## Project Purpose
- Static, dependency-free blog using semantic HTML only.
- Prioritizes content, accessibility, and performance over presentation.
- No build system; pages are hand-authored HTML files served by GitHub Pages.

## Directory Structure
```
blog/
├── CNAME                 # Custom domain configuration for GitHub Pages
├── robots.txt            # Search engine crawler directives
├── sitemap.xml           # XML sitemap for SEO
├── index.html            # Main blog page listing all posts
├── posts/                # Individual blog posts (YYYY-MM-DD-slug.html)
├── plants.html           # Plant catalog page
├── images/               # Optimized images (400w, 800w, 1200w in JPEG and WebP)
│   └── originals/        # Source high‑resolution images (JPG/JPEG)
└── optimize-images.sh    # Regenerate optimized images from originals (ImageMagick)
```

## Authoring Rules
- Use semantic HTML elements. Do not use `<div>` when a more meaningful element exists.
  - Prefer: `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<main>`, `<figure>`, `<figcaption>`, `<address>`, `<time>`, `<dl>/<dt>/<dd>`.
  - Only fall back to `<div>` when no semantic element fits (e.g., for microdata grouping).
- No CSS or JavaScript files. Avoid inline styles unless they already exist and are necessary for content clarity.
- Maintain a meaningful heading hierarchy (`h1` → `h2` → `h3`).
- Use `<time>` with accurate `datetime` values.
- Favor accessibility: clear structure, proper ARIA only when semantics aren’t sufficient.

## File Naming
- Posts: `YYYY-MM-DD-slug.html` (use hyphens; keep slugs concise and descriptive).

## Post Template
Use this baseline and adapt sections as needed while keeping semantics intact:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Brief description">
  <meta name="author" content="Storbeck">
  <title>Post Title - Storbeck Blog</title>
  <link rel="preconnect" href="https://github.com">
  <link rel="dns-prefetch" href="https://www.linkedin.com">
  <meta itemprop="author" content="Geoff Storbeck">
  <meta itemprop="headline" content="Post Title">
  <meta itemprop="datePublished" content="YYYY-MM-DD">
  <meta itemprop="description" content="Brief description">
  <meta itemprop="url" content="https://storbeck.dev/posts/YYYY-MM-DD-slug.html">
  <meta itemprop="mainEntityOfPage" content="https://storbeck.dev/posts/YYYY-MM-DD-slug.html">
  <meta itemprop="inLanguage" content="en">
  <meta itemprop="genre" content="Blog">
</head>
<body>
  <header>
    <nav aria-label="Site navigation">
      <a href="../index.html" rel="home">← Storbeck Blog</a>
    </nav>
  </header>

  <main>
    <article itemscope itemtype="http://schema.org/BlogPosting">
      <header>
        <h1 itemprop="headline">Post Title</h1>
        <p>
          <time datetime="YYYY-MM-DD" itemprop="datePublished">Published Month Day, Year</time>
          <span> • </span>
          <span>Category</span>
        </p>
      </header>

      <!-- Content sections -->
    </article>
  </main>

  <aside>
    <section>
      <h2>Related Topics</h2>
      <ul>
        <li>Topic links or references</li>
      </ul>
    </section>
  </aside>

  <footer>
    <nav aria-label="Post navigation">
      <a href="../index.html" rel="home">← Back to blog</a>
    </nav>
    <p><small>Last updated: <time datetime="YYYY-MM-DD">Month Day, Year</time></small></p>
  </footer>
</body>
</html>
```

## Structured Data (Schema.org Microdata)
- Blog post snippet pattern:
```html
<article itemscope itemtype="http://schema.org/BlogPosting">
  <h3><a href="url" itemprop="url" rel="bookmark"><span itemprop="headline">Post Title</span></a></h3>
  <time datetime="YYYY-MM-DD" itemprop="datePublished">Date</time>
  <p itemprop="description">Description</p>
  <meta itemprop="author" content="Geoff Storbeck">
</article>
```
- Person/author pattern:
```html
<div itemscope itemtype="http://schema.org/Person">
  <span itemprop="name">Name</span>
  <span itemprop="jobTitle">Title</span>
  <link itemprop="url" href="https://example.com">
  <link itemprop="sameAs" href="https://github.com/user">
</div>
```

## Links and Relationships
- Use appropriate `rel` values: `bookmark` (permalinks), `home` (back to homepage), `external` (off‑site), `me` (personal profiles), `author` (author info), and `noopener noreferrer` when needed for external links.
- Resource hints in `<head>` when beneficial: `preconnect`, `dns-prefetch`.

## Images and Performance
- Place source images in `images/originals/` (JPG/JPEG). Do not commit large PNGs or SVGs for photos.
- Generate responsive assets with `optimize-images.sh` (requires ImageMagick `magick`).
- Always embed images using `<picture>` with WebP and JPEG sources, set `width`, `height`, `loading="lazy"`, and `decoding="async"`.
```html
<picture>
  <source type="image/webp" srcset="image-400w.webp 400w, image-800w.webp 800w, image-1200w.webp 1200w">
  <source type="image/jpeg" srcset="image-400w.jpg 400w, image-800w.jpg 800w, image-1200w.jpg 1200w">
  <img src="image-800w.jpg" alt="..." width="200" height="267" loading="lazy" decoding="async">
  <!-- Prefer accurate width/height based on actual asset ratio. -->
  <!-- Consider `fetchpriority` only for above‑the‑fold hero images. -->
  </picture>
```

## Accessibility
- Prefer native semantics over ARIA; add ARIA only to clarify intent where HTML lacks semantics.
- Ensure navigable structure: headings, landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), clear link text.
- Use `<abbr title>`, `<kbd>`, `<blockquote>` with `<cite>`, `<figure>` with `<figcaption>` where appropriate.

## Editing Workflow
- Keep `index.html` in sync when adding/removing posts (add a new `<article>` entry in chronological order with microdata).
- Update `sitemap.xml` when adding/removing pages, including correct `<lastmod>` dates.
- Preserve `CNAME`, `robots.txt`, and existing URLs.
- Use relative links within the site; absolute links for external resources.

## Do / Don’t
- Do: Write clear, well‑structured HTML; keep content first; keep diffs minimal.
- Do: Add tests of content by manually opening `index.html` in a browser for quick verification.
- Don’t: Introduce CSS/JS frameworks, bundlers, or pipelines.
- Don’t: Add inline styles unless necessary and consistent with existing patterns.
- Don’t: Change file organization or naming conventions.

## Local Preview
- Open `index.html` directly in a browser to verify structure and links.
- Image generation requires ImageMagick (`magick`). Run: `./optimize-images.sh` from repo root.

