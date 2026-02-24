import { appendResponseHeader, defineEventHandler, getMethod, getRequestHeader, getRequestURL, getRouterParam, readRawBody, setResponseStatus } from 'h3'

const UPSTREAM_HOST = 'https://api-js.mixpanel.com'
const ALLOWED_PATH_PREFIXES = ['track', 'engage', 'groups', 'record', 'decide']

export default defineEventHandler(async (event) => {
  const path = (getRouterParam(event, 'path') || '').replace(/^\/+/, '')
  const firstSegment = path.split('/')[0] || ''

  if (!ALLOWED_PATH_PREFIXES.includes(firstSegment)) {
    setResponseStatus(event, 404, 'Not Found')
    return 'Not Found'
  }

  const incomingUrl = getRequestURL(event)
  const targetUrl = `${UPSTREAM_HOST}/${path}${incomingUrl.search || ''}`
  const method = getMethod(event)
  const contentType = getRequestHeader(event, 'content-type')
  const body = method === 'GET' || method === 'HEAD' ? undefined : await readRawBody(event, false)

  const upstream = await fetch(targetUrl, {
    method,
    headers: contentType ? { 'content-type': contentType } : undefined,
    body
  })

  setResponseStatus(event, upstream.status, upstream.statusText)

  const responseContentType = upstream.headers.get('content-type')
  if (responseContentType) {
    appendResponseHeader(event, 'content-type', responseContentType)
  }

  return await upstream.text()
})
