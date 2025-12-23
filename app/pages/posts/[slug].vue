<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: post } = await useAsyncData(`post-${slug.value}`, () => queryCollection('posts').path(`/posts/${slug.value}`).first())
const { data: allPosts } = await useAsyncData('post-list', () => queryCollection('posts').order('date', 'DESC').all())

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found.' })
}

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
}

const needsDotLottie = computed(() => post.value?.legacyUrl?.includes('lottie-quick-embed'))
const currentIndex = computed(() => {
  const list = allPosts.value || []
  const path = post.value?.path || `/posts/${slug.value}`
  return list.findIndex((entry) => entry.path === path)
})
const prevPost = computed(() => {
  if (currentIndex.value <= 0) return null
  return allPosts.value?.[currentIndex.value - 1] ?? null
})
const nextPost = computed(() => {
  if (currentIndex.value < 0) return null
  const list = allPosts.value || []
  return list[currentIndex.value + 1] ?? null
})

useHead(() => ({
  title: `${post.value?.title} - Geoff Storbeck`,
  meta: [
    { name: 'description', content: post.value?.description || '' },
    { property: 'og:title', content: post.value?.title || '' },
    { property: 'og:description', content: post.value?.description || '' }
  ],
  link: needsDotLottie.value
    ? [
        { rel: 'preconnect', href: 'https://unpkg.com' },
        { rel: 'dns-prefetch', href: 'https://unpkg.com' }
      ]
    : [],
  script: needsDotLottie.value
    ? [
        {
          type: 'module',
          src: 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs'
        }
      ]
    : []
}))
</script>

<template>
  <main class="post-shell">
    <nav class="post-nav post-nav--minimal" aria-label="Post navigation">
      <a href="/" rel="home">← Geoff Storbeck's Blog</a>
      <a href="/demos">Explore demos</a>
    </nav>

    <article class="post-article" itemscope itemtype="http://schema.org/BlogPosting">
      <header>
        <h1 itemprop="headline">{{ post?.title }}</h1>
        <p>
          <time :datetime="post?.date" itemprop="datePublished">{{ formatDate(String(post?.date)) }}</time>
          <span v-if="post?.category"> • {{ post?.category }}</span>
        </p>
      </header>

      <ContentRenderer :value="post" />
    </article>

    <nav class="post-pagination post-pagination--post" aria-label="Post pagination">
      <a v-if="prevPost" :href="prevPost.path">← Previous post</a>
      <a v-if="nextPost" :href="nextPost.path">Next post →</a>
    </nav>
  </main>
</template>
