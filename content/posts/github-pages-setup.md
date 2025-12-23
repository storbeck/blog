---
title: "Setting Up GitHub Pages with Custom Domain"
description: "Step-by-step guide to setting up GitHub Pages with a custom domain, including DNS configuration and HTTPS setup"
date: "2025-10-06"
category: "Technical Setup"
legacyUrl: "/posts/2025-10-06-github-pages-setup.html"
---

<p><strong>I just set up this blog using GitHub Pages with a custom domain. Here's the technical process and what I learned.</strong></p>

<section>
<h2>Why GitHub Pages?</h2>
<p>Free hosting, automatic deploys from git commits, and dead simple for static sites. Perfect for a basic blog that doesn't need server-side processing.</p>
</section>

<section>
<h2>Repository Structure</h2>
                
```
blog/
├── index.html          # Main blog page
├── posts/             # Individual blog posts
│   └── *.html
└── CNAME              # Custom domain configuration
```

</section>

<section>
<h2>DNS Configuration</h2>
<p>For a custom domain, you need to configure DNS records:</p>
<dl>
<dt><strong>A records</strong> for apex domain</dt>
<dd>Point to GitHub's IPs:
<ul>
<li><code>185.199.108.153</code></li>
<li><code>185.199.109.153</code></li>
<li><code>185.199.110.153</code></li>
<li><code>185.199.111.153</code></li>
</ul>
</dd>
<dt><strong>CNAME record</strong> for www subdomain</dt>
<dd>Point to <code>username.github.io</code></dd>
</dl>
</section>

<section>
<h2>GitHub Pages Settings</h2>
<p>In repository settings:</p>
<ol>
<li>Go to Pages section</li>
<li>Source: Deploy from a branch</li>
<li>Branch: main or master</li>
<li>Folder: <code>/ (root)</code></li>
<li>Custom domain: <code>your-domain.com</code></li>
</ol>
</section>

<section>
<h2>The CNAME File</h2>
<p>GitHub Pages requires a <code>CNAME</code> file in the repository root containing just your domain name. This tells GitHub which custom domain to serve the site on.</p>
</section>

<section>
<h2>HTTPS Certificate</h2>
<p>GitHub automatically provisions Let's Encrypt certificates for custom domains. Takes a few minutes after DNS propagation.</p>
</section>

<section>
<h2>Deploy Process</h2>
<p>Every git push to the main branch triggers an automatic deployment. No build process needed for static HTML - GitHub just serves the files directly.</p>
</section>

<section>
<h2>Limitations</h2>
<ul>
<li>Static sites only (no server-side processing)</li>
<li>1GB repository size limit</li>
<li>100GB bandwidth per month</li>
<li>Public repositories only for free accounts</li>
</ul>
</section>
