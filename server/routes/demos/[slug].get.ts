import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createError, getRouterParam, setHeader } from 'h3'
import { getDemoBySlug } from '../../utils/demos'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing demo slug.' })
  }

  const demo = getDemoBySlug(slug)
  if (!demo) {
    throw createError({ statusCode: 404, statusMessage: 'Demo not found.' })
  }

  const filePath = path.join(process.cwd(), 'legacy', 'posts', demo.legacyFile)
  const html = readFileSync(filePath, 'utf8')
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  return html
})
