import { readFileSync } from 'node:fs'
import path from 'node:path'
import { useStorage } from 'nitropack/runtime'
import { createError, getRouterParam, setHeader } from 'h3'
import { getDemoBySlug } from '../../utils/demos'

const storage = useStorage('/assets')

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing demo slug.' })
  }

  const demo = getDemoBySlug(slug)
  if (!demo) {
    throw createError({ statusCode: 404, statusMessage: 'Demo not found.' })
  }

  const assetPath = `legacy/posts/${demo.legacyFile}`
  let html = await storage.getItem<string>(assetPath)
  if (!html) {
    html = await storage.getItem<string>(`/legacy/posts/${demo.legacyFile}`)
  }
  if (!html) {
    html = await storage.getItem<string>(`posts/${demo.legacyFile}`)
  }
  if (!html && process.env.NODE_ENV !== 'production') {
    const diskPath = path.join(process.cwd(), 'legacy', 'posts', demo.legacyFile)
    html = readFileSync(diskPath, 'utf8')
  }
  if (!html) {
    throw createError({ statusCode: 404, statusMessage: 'Demo file not found.' })
  }
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  return html
})
