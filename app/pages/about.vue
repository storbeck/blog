<script setup lang="ts">
useHead({
  title: 'About - Geoff Storbeck',
  meta: [
    {
      name: 'description',
      content: "Professional history and current work by Geoff Storbeck."
    }
  ]
})
</script>

<template>
  <div class="page-shell">
    <SiteMasthead active="about" />
    <main class="interior-main">
      <article itemscope itemtype="http://schema.org/Person">
      <header class="about-hero">
        <figure class="about-photo">
          <picture>
            <source
              type="image/webp"
              srcset="/images/profile-400w.webp 400w, /images/profile-800w.webp 800w, /images/profile-1200w.webp 1200w"
            >
            <source
              type="image/jpeg"
              srcset="/images/profile-400w.jpg 400w, /images/profile-800w.jpg 800w, /images/profile-1200w.jpg 1200w"
            >
            <img
              src="/images/profile-400w.jpg"
              alt="Geoff Storbeck profile photo"
              width="400"
              height="400"
              loading="eager"
              decoding="async"
            >
          </picture>
        </figure>
        <h1>About Me</h1>
      </header>

      <p itemprop="description">
        I build approachable, content-first interfaces as a freelance frontend developer based in Ormond Beach, Florida.
        I have been working in production environments since 2008 across web hosting, fintech, and offensive security,
        with a through-line of turning complex systems into clear, usable workflows.
      </p>
      <p>
        For frontend contract work, I take projects through PageFoundry LLC. Hire me at
        <a href="https://pagefoundry.dev" rel="external">pagefoundry.dev</a>.
      </p>
      <p>
        I work primarily with React, TypeScript, HTML, CSS, and modern frontend tooling, and I focus on systems that
        need to be fast, maintainable, and clear for both users and developers.
      </p>

      <section aria-labelledby="about-background">
        <h2 id="about-background">Professional history</h2>
        <p>
          I started at Jumpline.com (2008-2012) in Columbus, where I moved into systems administration and handled
          production operations end to end: incident response, vulnerability patching, abuse handling, hardware failures,
          and network changes. I worked on cross-datacenter migration projects, completed roughly 300 live server
          migrations without service interruption, and built internal tooling to automate duplication and recovery
          workflows.
        </p>
        <p>
          At JPMorgan Chase (2012-2021), I shifted toward product-facing engineering and UI architecture for internal
          platforms. I built and maintained tools in Move Money and Identity and Access Management, then moved into lead
          UI/UX roles for Account Lifecycle Management and Cassandra as a Service. The work included design studios with
          users, building MVPs adopted firm-wide, and maintaining multiple applications across teams.
        </p>
        <p>
          At Praetorian (2021-2025), I served as Staff Software Engineer on the Chariot offensive security platform and
          led the frontend rewrite. We moved from monthly releases to same-day delivery and established a React,
          TypeScript, and TailwindCSS architecture that improved developer velocity and long-term maintainability. I also
          mentored frontend engineers and worked across the security workflow, including scanning, triage, and
          remediation-focused interfaces.
        </p>
        <p>
          Alongside full-time work, I contributed to FreeCodeCamp (2015), helping shape frontend curriculum and project
          examples while supporting students through the learning community.
        </p>
        <p>
          Today I run PageFoundry LLC (2025-present), delivering contract frontend engineering for startups and small
          teams. I partner directly with product owners and engineers on greenfield builds and refactors, focusing on
          architecture, performance, and maintainability.
        </p>
      </section>

      </article>
    </main>
  </div>
</template>
