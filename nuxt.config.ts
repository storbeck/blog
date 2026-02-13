import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const demosPath = path.join(process.cwd(), 'data', 'demos.json')
const demos = JSON.parse(readFileSync(demosPath, 'utf8')) as Array<{ slug: string }>
const demoSlugs = new Set(demos.map((demo) => demo.slug))
const legacyDir = path.join(process.cwd(), 'legacy', 'posts')
const legacyFiles = (() => {
  try {
    return readdirSync(legacyDir)
  } catch {
    return []
  }
})()

const legacyRedirects = legacyFiles
  .filter((file) => file.endsWith('.html'))
  .reduce<Record<string, { redirect: { to: string; statusCode: number } }>>((acc, file) => {
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.html$/, '')
    const target = demoSlugs.has(slug) ? `/demos/${slug}` : `/posts/${slug}`
    acc[`/posts/${file}`] = { redirect: { to: target, statusCode: 301 } }
    return acc
  }, {})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'vercel',
    serverAssets: [{ baseName: 'legacy', dir: path.resolve(process.cwd(), 'legacy') }],
    prerender: {
      routes: ['/about']
    }
  },
  modules: ['@nuxt/content'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    },
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      }
    },
    renderer: {
      anchorLinks: false
    }
  },
  routeRules: {
    '/index.html': { redirect: { to: '/', statusCode: 301 } },
    ...legacyRedirects
  },
  app: {
    head: {
      title: "Geoff Storbeck's Blog",
      script: [
        {
          'data-goatcounter': 'https://storbeck.goatcounter.com/count',
          async: true,
          src: '//gc.zgo.at/count.js'
        }
      ],
      meta: [
        {
          name: 'description',
          content:
            'Technical blog by Geoff Storbeck covering frontend development, web performance, security, DevOps, and practical tooling.'
        },
        { property: 'og:title', content: "Geoff Storbeck's Blog" },
        {
          property: 'og:description',
          content: 'Technical blog on frontend, performance, security engineering, DevOps, and practical tooling.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://storbeck.dev/' },
        { property: 'og:site_name', content: 'Storbeck Blog' },
        { property: 'og:image', content: 'https://storbeck.dev/images/profile-1200w.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: "Geoff Storbeck's Blog" },
        { name: 'twitter:description', content: 'Frontend, performance, security engineering, DevOps, and tooling.' },
        { name: 'twitter:image', content: 'https://storbeck.dev/images/profile-1200w.jpg' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Merriweather:wght@700;900&family=Public+Sans:wght@400;500;600&display=swap'
        },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css' },
        { rel: 'preconnect', href: 'https://github.com' },
        { rel: 'dns-prefetch', href: 'https://www.linkedin.com' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'stylesheet', href: '/styles.css' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Storbeck Blog RSS', href: '/feed.xml' }
      ]
    }
  }
})
