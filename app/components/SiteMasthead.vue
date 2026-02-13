<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: 'latest' | 'about' | 'demos' }>(), {
  active: 'latest'
})

const theme = useState<'light' | 'dark'>('theme', () => 'light')
const isDark = computed(() => theme.value === 'dark')
const toggleTheme = () => {
  theme.value = isDark.value ? 'light' : 'dark'
}

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
}

const today = computed(() => formatDate(new Date().toISOString().slice(0, 10)))
</script>

<template>
  <header class="site-hero nyt-header" itemscope itemtype="http://schema.org/Person">
    <div class="nyt-topbar">
      <div class="nyt-topbar__left">
        <p class="nyt-date">{{ today }}</p>
        <span class="nyt-separator" aria-hidden="true">|</span>
        <p class="nyt-paper">Ormond Beach, Florida</p>
      </div>
      <div class="nyt-topbar__right">
        <button
          class="theme-toggle"
          type="button"
          :aria-pressed="isDark"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <span class="mdi theme-toggle__icon" :class="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" aria-hidden="true"></span>
        </button>
        <a href="/feed.xml" rel="alternate">Subscribe</a>
        <a href="https://www.linkedin.com/in/geoff-storbeck-81a25035/" rel="external me" itemprop="sameAs">LinkedIn</a>
        <a href="https://github.com/storbeck" rel="external me" itemprop="sameAs">GitHub</a>
      </div>
    </div>
    <div class="nyt-logo">
      <h1><NuxtLink to="/" rel="home"><span itemprop="name">Geoff Storbeck</span>'s Blog</NuxtLink></h1>
    </div>
    <nav class="nyt-nav" aria-label="Site sections">
      <NuxtLink to="/" :aria-current="props.active === 'latest' ? 'page' : undefined">Latest</NuxtLink>
      <NuxtLink to="/about" :aria-current="props.active === 'about' ? 'page' : undefined">About me</NuxtLink>
      <NuxtLink to="/#archive">Archive</NuxtLink>
      <NuxtLink to="/demos" :aria-current="props.active === 'demos' ? 'page' : undefined">Demos</NuxtLink>
      <a href="https://pagefoundry.dev" rel="external" class="hire-cta">Hire me</a>
    </nav>
    <link itemprop="url" href="https://storbeck.dev">
  </header>
</template>
