export type Comment = {
  id: string
  name: string
  body: string
  createdAt: string
}

const globalStores = globalThis as {
  __commentStore?: Map<string, Comment[]>
  __viewsStore?: Map<string, number>
}

export const getCommentStore = () => {
  if (!globalStores.__commentStore) {
    globalStores.__commentStore = new Map()
  }
  return globalStores.__commentStore
}

export const getViewsStore = () => {
  if (!globalStores.__viewsStore) {
    globalStores.__viewsStore = new Map()
  }
  return globalStores.__viewsStore
}
