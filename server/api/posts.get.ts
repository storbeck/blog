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
  const pagedWithExcerpt = paged.map((post) => ({
    ...post,
    excerpt: `<p>${post.description}</p>`
  }))

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
