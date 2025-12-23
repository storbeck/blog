import { promises as fs } from 'node:fs'
import path from 'node:path'
import { getQuery } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { getDemos } from '../utils/demos'

type PostSummary = {
  slug: string
  url: string
  title: string
  description: string
  date: string
  category?: string
  excerpt?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts')
const excerptCache = new Map<string, string>()

const getExcerpt = async (slug: string, description: string) => {
  if (excerptCache.has(slug)) return excerptCache.get(slug) || ''
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`)
    const source = await fs.readFile(filePath, 'utf8')
    const match = source.match(/<p[^>]*>[\s\S]*?<\/p>/i)
    if (match?.[0]) {
      excerptCache.set(slug, match[0])
      return match[0]
    }
  } catch {
    // Fall back to description.
  }
  const fallback = `<p>${description}</p>`
  excerptCache.set(slug, fallback)
  return fallback
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1)
  const pageSize = Math.max(1, Number.parseInt(String(query.pageSize ?? '10'), 10) || 10)

  const docs = await queryCollection(event, 'posts')
    .select('title', 'description', 'date', 'category', 'path')
    .order('date', 'DESC')
    .all()

  const posts = (docs as Array<Record<string, unknown>>).map((doc) => {
    const pathValue = String(doc.path || '')
    const slug = pathValue.replace('/posts/', '')
    return {
      slug,
      url: pathValue,
      title: String(doc.title || ''),
      description: String(doc.description || ''),
      date: String(doc.date || ''),
      category: doc.category ? String(doc.category) : undefined
    } satisfies PostSummary
  })

  const demos = getDemos()
  const total = posts.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const paged = posts.slice(start, start + pageSize)
  const pagedWithExcerpt = await Promise.all(
    paged.map(async (post) => ({
      ...post,
      excerpt: await getExcerpt(post.slug, post.description)
    }))
  )

  return {
    page,
    pageSize,
    total,
    totalPages,
    posts: pagedWithExcerpt,
    allPosts: posts,
    demos
  }
})
