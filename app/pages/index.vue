<script setup lang="ts">
const route = useRoute()
const pageSize = 10

const initialPage = computed(() => {
  const raw = Array.isArray(route.query.page) ? route.query.page[0] : route.query.page
  const value = Number.parseInt(String(raw ?? '1'), 10)
  return Number.isFinite(value) && value > 0 ? value : 1
})

const currentPage = ref(initialPage.value)
const posts = ref<Array<Record<string, unknown>>>([])
const allPosts = ref<Array<Record<string, unknown>>>([])
const demos = ref<Array<Record<string, unknown>>>([])
const totalPages = ref(1)
const isLoadingMore = ref(false)

const { data: weatherData } = await useAsyncData('weather', () => $fetch('/api/weather'))

const { data, pending, error } = await useAsyncData(`posts-page-${currentPage.value}`, () =>
  $fetch('/api/posts', { query: { page: currentPage.value, pageSize } })
)

if (data.value) {
  posts.value = data.value.posts || []
  allPosts.value = data.value.allPosts || []
  demos.value = data.value.demos || []
  totalPages.value = data.value.totalPages || 1
}

const hasNext = computed(() => currentPage.value < totalPages.value)

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
}

const weather = computed(() => weatherData.value ?? null)
const weatherMeta = computed(() => {
  if (!weather.value) return ''
  const parts = []
  if (typeof weather.value.humidity === 'number') {
    parts.push(`Humidity ${Math.round(weather.value.humidity)}%`)
  }
  return parts.join(' | ')
})
const forecastCards = computed(() => {
  if (!weather.value?.forecast?.length) return []
  return weather.value.forecast.map((entry) => ({
    label: entry.label,
    highF: entry.highF,
    lowF: entry.lowF,
    condition: entry.condition
  }))
})
const weatherAriaLabel = computed(() => {
  if (!weather.value) return ''
  const baseParts = [`${weather.value.condition}`, `${weather.value.tempF}F`]
  if (typeof weather.value.humidity === 'number') {
    baseParts.push(`Humidity ${Math.round(weather.value.humidity)}%`)
  }
  if (typeof weather.value.windMph === 'number') {
    baseParts.push(`Wind ${weather.value.windMph} mph`)
  }
  if (!forecastCards.value.length) return baseParts.join(' | ')
  const forecastText = forecastCards.value
    .map((entry) => {
      const temps = [entry.highF, entry.lowF].filter((value) => typeof value === 'number')
      const tempText = temps.length ? `${temps.join('/')}F` : ''
      return `${entry.label}: ${tempText} ${entry.condition}`.trim()
    })
    .join(' | ')
  return `${baseParts.join(' | ')}. Forecast: ${forecastText}`
})
const tideSummary = computed(() => {
  const tides = weather.value?.tides
  if (!tides) return ''
  const high = tides.high.length ? `High ${tides.high.join(', ')}` : ''
  const low = tides.low.length ? `Low ${tides.low.join(', ')}` : ''
  return [high, low].filter(Boolean).join(' · ')
})

const leadPost = computed(() => posts.value[0])
const secondaryPosts = computed(() => posts.value.slice(1))

const loadMore = async () => {
  if (isLoadingMore.value || !hasNext.value) return
  isLoadingMore.value = true
  const nextPage = currentPage.value + 1
  const nextData = await $fetch('/api/posts', { query: { page: nextPage, pageSize } })
  posts.value = posts.value.concat(nextData.posts || [])
  allPosts.value = nextData.allPosts || allPosts.value
  demos.value = nextData.demos || demos.value
  totalPages.value = nextData.totalPages || totalPages.value
  currentPage.value = nextPage
  isLoadingMore.value = false
}

const archiveGroups = computed(() => {
  const allPostsList = allPosts.value || []
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' })
  const groups: Array<{ year: string; posts: Array<(typeof allPostsList)[number] & { monthLabel: string }> }> = []
  for (const post of allPostsList) {
    const year = String(post.date || '').slice(0, 4)
    const monthValue = String(post.date || '').slice(5, 7)
    const monthDate = new Date(`${year}-${monthValue}-01T00:00:00Z`)
    const month = Number.isNaN(monthDate.getTime()) ? monthValue : formatter.format(monthDate)
    let yearGroup = groups.find((group) => group.year === year)
    if (!yearGroup) {
      yearGroup = { year, posts: [] }
      groups.push(yearGroup)
    }
    yearGroup.posts.push({ ...post, monthLabel: month })
  }
  return groups
})
</script>

<template>
  <div class="page-shell">
    <header class="site-hero nyt-header" itemscope itemtype="http://schema.org/Person">
      <div class="nyt-topbar">
        <div class="nyt-topbar__left">
          <p class="nyt-date">{{ formatDate(new Date().toISOString().slice(0, 10)) }}</p>
          <span class="nyt-separator" aria-hidden="true">|</span>
          <p class="nyt-paper">Ormond Beach, Florida</p>
          <button v-if="weather" class="weather-chip" type="button" :aria-label="weatherAriaLabel">
            <span class="weather-temp">{{ weather.tempF }}F</span>
            <span class="weather-tooltip">
              <span class="weather-tooltip__header">
                <span class="weather-tooltip__temp">{{ weather.tempF }}F</span>
                <span class="weather-tooltip__condition">{{ weather.condition }}</span>
                <span v-if="weather.windMph !== undefined" class="weather-tooltip__wind">Wind {{ weather.windMph }} mph</span>
              </span>
              <span v-if="weatherMeta" class="weather-tooltip__meta">{{ weatherMeta }}</span>
              <span v-if="tideSummary" class="weather-tooltip__tides">Tides (Daytona Beach): {{ tideSummary }}</span>
              <span class="weather-tooltip__label">5‑Day Outlook</span>
              <ul class="weather-tooltip__list">
                <li v-for="entry in forecastCards" :key="`${entry.label}-${entry.highF}-${entry.lowF}`">
                  <span class="weather-card__label">{{ entry.label }}</span>
                  <span class="weather-card__temp">
                    <span v-if="entry.highF !== undefined && entry.lowF !== undefined">{{ entry.highF }}/{{ entry.lowF }}F</span>
                    <span v-else-if="entry.highF !== undefined">{{ entry.highF }}F</span>
                    <span v-else-if="entry.lowF !== undefined">{{ entry.lowF }}F</span>
                  </span>
                  <span class="weather-card__condition">{{ entry.condition }}</span>
                </li>
              </ul>
            </span>
          </button>
        </div>
        <div class="nyt-topbar__right">
          <a href="/feed.xml" rel="alternate">Subscribe</a>
          <a href="https://www.linkedin.com/in/geoff-storbeck-81a25035/" rel="external me" itemprop="sameAs">LinkedIn</a>
          <a href="https://github.com/storbeck" rel="external me" itemprop="sameAs">GitHub</a>
        </div>
      </div>
      <div class="nyt-logo">
        <h1><span itemprop="name">Geoff Storbeck</span>'s Blog</h1>
      </div>
      <nav class="nyt-nav" aria-label="Site sections">
        <a href="#recent-posts">Latest</a>
        <a href="/about">About me</a>
        <a href="#archive">Archive</a>
        <a href="/demos">Demos</a>
        <a href="#related-links">Links</a>
      </nav>
      <link itemprop="url" href="https://storbeck.dev">
    </header>

    <main>
      <section class="recent-posts newspaper-column" id="recent-posts">
        <header>
          <h2>Latest Articles</h2>
          <p>Recent posts and experiments from the workshop, newest first.</p>
        </header>
        <p v-if="pending">Loading posts...</p>
        <p v-else-if="error">Posts could not be loaded right now.</p>
        <template v-else>
          <article v-if="leadPost" class="lead-story" itemscope itemtype="http://schema.org/BlogPosting">
            <h3>
              <a :href="leadPost.url" itemprop="url" rel="bookmark">
                <span itemprop="headline">{{ leadPost.title }}</span>
              </a>
            </h3>
            <p class="post-meta">
              <small>
                <time :datetime="leadPost.date" itemprop="datePublished">{{ formatDate(leadPost.date) }}</time>
                <span v-if="leadPost.category"> • {{ leadPost.category }}</span>
              </small>
            </p>
            <div class="post-excerpt" v-html="leadPost.excerpt || `<p>${leadPost.description}</p>`"></div>
            <meta itemprop="author" content="Geoff Storbeck">
          </article>
          <div class="recent-grid">
            <article v-for="post in secondaryPosts" :key="post.url" class="recent-post" itemscope itemtype="http://schema.org/BlogPosting">
              <h3>
                <a :href="post.url" itemprop="url" rel="bookmark">
                  <span itemprop="headline">{{ post.title }}</span>
                </a>
              </h3>
              <p class="post-meta">
                <small>
                  <time :datetime="post.date" itemprop="datePublished">{{ formatDate(post.date) }}</time>
                  <span v-if="post.category"> • {{ post.category }}</span>
                </small>
              </p>
              <div class="post-excerpt" v-html="post.excerpt || `<p>${post.description}</p>`"></div>
              <meta itemprop="author" content="Geoff Storbeck">
            </article>
          </div>
        </template>

        <nav v-if="totalPages > 1" class="post-pagination" aria-label="Pagination">
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button v-if="hasNext" class="load-more" type="button" :disabled="isLoadingMore" @click="loadMore">
            <span v-if="isLoadingMore">Loading...</span>
            <span v-else>Older posts</span>
          </button>
        </nav>
      </section>

      <section class="demos-block" id="demos">
        <header>
          <h2>Demos</h2>
          <p>Hands-on experiments and UI playgrounds that need full HTML/CSS/JS.</p>
        </header>
        <ul class="demos-list">
          <li v-for="demo in demos" :key="demo.slug">
            <a :href="`/demos/${demo.slug}`">{{ demo.title }}</a>
            <time :datetime="demo.date">{{ formatDate(demo.date) }}</time>
          </li>
        </ul>
        <p><a href="/demos">Browse all demos →</a></p>
      </section>

      <section class="archive-section" id="archive">
        <header>
          <h2>Archive</h2>
          <p>Every post, grouped by year and month.</p>
        </header>
        <div class="archive-grid">
          <section v-for="group in archiveGroups" :key="group.year" class="archive-year">
            <h3>{{ group.year }}</h3>
            <ul class="archive-list">
              <li v-for="post in group.posts" :key="`archive-${post.url}`">
                <span class="archive-month-label">{{ post.monthLabel }}</span>
                <a :href="post.url">{{ post.title }}</a>
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              </li>
            </ul>
          </section>
        </div>
      </section>

      <section id="related-links">
        <h2>Related Links & Projects</h2>
        <ul>
          <li><a href="/iframe-sandbox-test-suite.html">Iframe Sandbox Breakout Test Suite</a> - Self-contained HTML test harness for sandbox behaviors</li>
          <li><a href="https://github.com/storbeck/git-recent" rel="external">Git Recent</a> - Git utility for recent branch management</li>
          <li><a href="https://github.com/storbeck/maze" rel="external">Maze Generator</a> - Go CLI that prints Hunt-and-Kill mazes on demand</li>
          <li><a href="https://github.com/storbeck/flhulls" rel="external">FL Hulls</a> - NPM package for Hull's Seafood Market pricing</li>
          <li><a href="https://github.com/storbeck/configs" rel="external">System Configs</a> - Dotfiles and configuration management</li>
          <li><a href="/plants.html">Backyard Plant Catalog</a> - Complete index of plants in my Ormond Beach backyard</li>
        </ul>
      </section>
    </main>

    <footer>
      <hr>
      <address>
        <a href="https://www.linkedin.com/in/geoff-storbeck-81a25035/" rel="external me">LinkedIn</a> • <a href="https://github.com/storbeck" rel="external me">GitHub</a>
      </address>
      <p><small>All opinions are my own and do not reflect those of my employer.</small></p>
      <p><small>© 2025 Storbeck</small></p>
    </footer>
  </div>
</template>
