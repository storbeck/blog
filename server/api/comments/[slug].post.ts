import { randomUUID } from 'node:crypto'
import { createError, getRouterParam, readBody } from 'h3'
import { getCommentStore, type Comment } from '../../utils/stores'

type CommentPayload = {
  name?: string
  body?: string
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug.' })
  }

  const payload = (await readBody(event)) as CommentPayload
  const name = payload?.name?.trim()
  const body = payload?.body?.trim()

  if (!name || !body) {
    throw createError({ statusCode: 400, statusMessage: 'Name and body are required.' })
  }

  const comment: Comment = {
    id: randomUUID(),
    name,
    body,
    createdAt: new Date().toISOString()
  }

  const store = getCommentStore()
  const existing = store.get(slug) ?? []
  existing.push(comment)
  store.set(slug, existing)

  return { slug, comment }
})
