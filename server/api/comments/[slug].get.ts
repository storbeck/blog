import { createError, getRouterParam } from 'h3'
import { getCommentStore } from '../../utils/stores'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug.' })
  }

  const store = getCommentStore()
  return { slug, comments: store.get(slug) ?? [] }
})
