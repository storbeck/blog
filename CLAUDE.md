# Blog Structure and Philosophy

## Directory Structure
```
blog/
├── CNAME                 # Custom domain configuration for GitHub Pages
├── robots.txt            # Search engine crawler directives
├── sitemap.xml           # XML sitemap for SEO
├── index.html            # Main blog page listing all posts
├── posts/               # Individual blog posts
│   ├── 2024-10-06-github-pages-setup.html
│   └── 2025-10-07-cloudflare-dynamic-dns.html
├── plants.html          # Plant catalog page
├── images/              # Optimized images (400w, 800w, 1200w in JPEG and WebP)
│   └── originals/       # Source high-resolution images
└── optimize-images.sh   # Script to regenerate optimized images from originals
```

## Design Philosophy

This blog intentionally uses **semantic HTML only** without CSS or JavaScript. This approach:

### Semantic Elements First
**NEVER use `<div>` when a semantic element exists.** Choose the most meaningful element:
- `<article>` for self-contained content (blog posts, catalog entries)
- `<section>` for thematic groupings of content
- `<nav>` for navigation links
- `<aside>` for tangentially related content
- `<header>` and `<footer>` for introductory/closing content
- `<main>` for the primary content of the document
- `<figure>` and `<figcaption>` for images with captions
- `<address>` for contact information
- `<time>` for dates and times
- `<dl>`, `<dt>`, `<dd>` for key-value pairs and definitions

Only use `<div>` as a last resort when no semantic element fits.

### Prioritizes Content Over Presentation
- Reader focus remains on the actual content
- Fast loading times (no external resources)
- Works on any device or browser, including text-based ones
- Accessible by default to screen readers and assistive technology

### Follows Web Standards
- Uses proper HTML5 semantic elements (`<header>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
- **NEVER use `<div>` when a semantic element exists** - always choose the most meaningful element
- Meaningful heading hierarchy (`h1` → `h2` → `h3`)
- Proper use of `<time>` elements with `datetime` attributes
- Navigation with `aria-label` and `rel` attributes
- Structured data through schema.org microdata (`itemscope`, `itemtype`, `itemprop`)
- Appropriate ARIA roles and labels where semantic HTML needs enhancement

### Universal Accessibility
- No dependencies means it works everywhere
- Screen readers can navigate properly with semantic structure
- Keyboard navigation works by default
- Text scales with user preferences
- High contrast ratios maintained across all browsers

## Content Guidelines

### Post Structure
Each blog post should follow this template:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Brief description">
    <meta name="author" content="Storbeck">
    <title>Post Title - Storbeck Blog</title>
</head>
<body>
    <header>
        <nav aria-label="Site navigation">
            <a href="../index.html" rel="home">← Storbeck Blog</a>
        </nav>
    </header>
    
    <main>
        <article>
            <header>
                <h1>Post Title</h1>
                <p>
                    <time datetime="YYYY-MM-DD">Published Month Day, Year</time>
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

### File Naming
- Posts: `YYYY-MM-DD-slug.html`
- Use hyphens for word separation
- Keep slugs descriptive but concise

### Content Formatting
- Use `<pre><code>` for code blocks
- Use `<kbd>` for keyboard shortcuts
- Use `<dl>`, `<dt>`, `<dd>` for definition lists
- Use `<blockquote>` with `<cite>` for quotes
- Use `<strong>` for emphasis, `<em>` for stress
- Use proper list structures (`<ul>`, `<ol>`, `<li>`)
- Use `<address>` for contact information
- Use `<figure>` and `<figcaption>` for images with captions
- Use `<mark>` for highlighted/referenced text
- Use `<abbr>` with `title` for abbreviations

### Structured Data with Schema.org Microdata
All content should include appropriate schema.org microdata for machine readability:

**For blog posts:**
```html
<article itemscope itemtype="http://schema.org/BlogPosting">
  <h3><a href="url" itemprop="url" rel="bookmark">
    <span itemprop="headline">Post Title</span>
  </a></h3>
  <time datetime="YYYY-MM-DD" itemprop="datePublished">Date</time>
  <p itemprop="description">Description</p>
  <meta itemprop="author" content="Geoff Storbeck">
</article>
```

**For person/author information:**
```html
<div itemscope itemtype="http://schema.org/Person">
  <span itemprop="name">Name</span>
  <span itemprop="jobTitle">Title</span>
  <link itemprop="url" href="https://example.com">
  <link itemprop="sameAs" href="https://github.com/user">
</div>
```

### Link Relationships
Use appropriate `rel` attributes to indicate link relationships:
- `rel="bookmark"` for article permalinks
- `rel="home"` for navigation back to homepage
- `rel="external"` for links to other websites
- `rel="me"` for links to your own profiles/properties (IndieWeb)
- `rel="author"` for links to author information
- `rel="noopener noreferrer"` for external links when appropriate

### Performance Hints
Include resource hints in `<head>` where beneficial:
- `<link rel="preconnect" href="...">` for critical external resources
- `<link rel="dns-prefetch" href="...">` for likely-needed external domains

### Responsive Images
Always use `<picture>` elements with proper sources:
```html
<picture>
  <source type="image/webp" srcset="image-400w.webp 400w, image-800w.webp 800w">
  <source type="image/jpeg" srcset="image-400w.jpg 400w, image-800w.jpg 800w">
  <img src="image-800w.jpg" alt="..." width="200" height="267" loading="lazy" decoding="async">
</picture>
```

## Why No CSS or JavaScript?

### Performance
- Zero external dependencies
- Instant loading on any connection
- No render blocking
- Minimal bandwidth usage

### Maintenance
- No build process required
- No framework updates to manage
- No compatibility issues
- Future-proof (HTML standards are stable)

### Accessibility First
- Works with all assistive technologies
- Respects user preferences (dark mode, font size, etc.)
- No interaction patterns that could confuse users
- Screen readers get pure content structure

### Philosophy
> "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."
> — Tim Berners-Lee, W3C Director and inventor of the World Wide Web

This blog embodies the original vision of the web: a universal information system accessible to everyone, regardless of their device, capabilities, or technical sophistication.

## Deployment

Uses GitHub Pages with automatic deployment on push to main branch. The `CNAME` file enables custom domain hosting.

## When Adding New Posts

1. Create HTML file in `posts/` directory following naming convention
2. Follow the semantic structure template
3. Add entry to `index.html` with proper datetime and description
4. Commit and push - GitHub Pages handles the rest

Keep it simple, keep it semantic, keep it accessible.