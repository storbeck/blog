import { createError, getRouterParam } from 'h3'
import { getViewsStore } from '../../utils/stores'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug.' })
  }

  const store = getViewsStore()
  const next = (store.get(slug) ?? 0) + 1
  store.set(slug, next)

  return { slug, views: next }
})
