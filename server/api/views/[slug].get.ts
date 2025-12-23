import { createError, getRouterParam } from 'h3'
import { getViewsStore } from '../../utils/stores'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug.' })
  }

  const store = getViewsStore()
  return { slug, views: store.get(slug) ?? 0 }
})
