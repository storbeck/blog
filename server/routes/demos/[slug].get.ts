import { createError, getRouterParam, setHeader } from 'h3'
import { getDemoBySlug } from '../../utils/demos'

const demoHtmlFiles = import.meta.glob('/legacy/posts/*.html', { as: 'raw', eager: true })

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing demo slug.' })
  }

  const demo = getDemoBySlug(slug)
  if (!demo) {
    throw createError({ statusCode: 404, statusMessage: 'Demo not found.' })
  }

  const filePath = `/legacy/posts/${demo.legacyFile}`
  const html = demoHtmlFiles[filePath]
  if (!html) {
    throw createError({ statusCode: 404, statusMessage: 'Demo file not found.' })
  }
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  return html
})
