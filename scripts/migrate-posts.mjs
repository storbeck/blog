import { promises as fs } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, 'public', 'posts')
const legacyDir = path.join(root, 'legacy', 'posts')
const contentDir = path.join(root, 'content', 'posts')
const demosPath = path.join(root, 'data', 'demos.json')

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true })
}

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const getMetaContent = (html, name) => {
  const match = html.match(
    new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=(["'])([\\s\\S]*?)\\1`, 'i')
  )
  if (match?.[2]) return match[2]
  const reverse = html.match(
    new RegExp(`<meta\\s+[^>]*content=(["'])([\\s\\S]*?)\\1[^>]*name=["']${name}["']`, 'i')
  )
  return reverse?.[2] ?? ''
}

const getItempropContent = (html, name) => {
  const match = html.match(
    new RegExp(`<meta\\s+[^>]*itemprop=["']${name}["'][^>]*content=(["'])([\\s\\S]*?)\\1`, 'i')
  )
  if (match?.[2]) return match[2]
  const reverse = html.match(
    new RegExp(`<meta\\s+[^>]*content=(["'])([\\s\\S]*?)\\1[^>]*itemprop=["']${name}["']`, 'i')
  )
  return reverse?.[2] ?? ''
}

const getHeadline = (html) => {
  const h1 = html.match(/<h1[^>]*itemprop=["']headline["'][^>]*>([^<]+)<\/h1>/i)?.[1]
  if (h1) return decodeEntities(h1.trim())
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
  if (!title) return ''
  return decodeEntities(title.replace(/\s+-\s+Storbeck Blog\s*$/i, '').trim())
}

const getCategory = (html) => {
  const match = html.match(/<time[^>]*>[^<]*<\/time>\s*<span>\s*•\s*<\/span>\s*<span>([^<]+)<\/span>/i)
  return match?.[1]?.trim()
}

const extractArticleBody = (html) => {
  const match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (!match) return ''
  let body = match[1]
  body = body.replace(/<header[^>]*>[\s\S]*?<\/header>/i, '')
  body = body.replace(/^\s+|\s+$/g, '')
  return body
}

const normalizeAssetPaths = (html) =>
  html
    .replace(/\.\.\/images\//g, '/images/')
    .replace(/\.\.\/videos\//g, '/videos/')
    .replace(/\.\.\/lottie\//g, '/lottie/')

const buildFrontmatter = (data) => {
  const lines = [
    '---',
    `title: "${data.title.replace(/"/g, '\\"')}"`,
    `description: "${data.description.replace(/"/g, '\\"')}"`,
    `date: "${data.date}"`,
    data.category ? `category: "${data.category.replace(/"/g, '\\"')}"` : null,
    `legacyUrl: "${data.legacyUrl}"`
  ].filter(Boolean)

  return `${lines.join('\n')}\n---\n`
}

const isDemoPost = (html) => /<script\b|<style\b/i.test(html)

const main = async () => {
  await ensureDir(legacyDir)
  await ensureDir(contentDir)
  await ensureDir(path.join(root, 'data'))

  const entries = await fs.readdir(sourceDir)
  const demos = []

  for (const entry of entries) {
    if (!entry.endsWith('.html')) continue

    const filePath = path.join(sourceDir, entry)
    const html = await fs.readFile(filePath, 'utf8')
    const slug = entry.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.html$/, '')
    const title = getHeadline(html) || slug
    const description = decodeEntities(getMetaContent(html, 'description'))
    const date = getItempropContent(html, 'datePublished') || entry.slice(0, 10)
    const category = getCategory(html)
    const legacyUrl = `/posts/${entry}`
    const demo = isDemoPost(html)

    if (demo) {
      demos.push({
        slug,
        title,
        description,
        date,
        category,
        legacyUrl,
        legacyFile: entry
      })
    } else {
      const body = normalizeAssetPaths(extractArticleBody(html))
      const frontmatter = buildFrontmatter({ title, description, date, category, legacyUrl })
      const outPath = path.join(contentDir, `${slug}.md`)
      await fs.writeFile(outPath, `${frontmatter}\n${body}\n`, 'utf8')
    }

    await fs.rename(filePath, path.join(legacyDir, entry))
  }

  demos.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)))
  await fs.writeFile(demosPath, `${JSON.stringify(demos, null, 2)}\n`, 'utf8')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
