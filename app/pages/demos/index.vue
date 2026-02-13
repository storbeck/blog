<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/posts', {
  query: { page: 1, pageSize: 1 }
})

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
}
</script>

<template>
  <div class="page-shell">
    <SiteMasthead active="demos" />
    <main class="interior-main">
      <header class="demo-hero">
        <p class="demo-kicker">Demos</p>
        <h1>Hands-on experiments and UI playgrounds</h1>
        <p>These are the posts that need raw HTML, CSS, and JavaScript to make the idea click.</p>
      </header>

      <section v-if="pending">
        <p>Loading demos...</p>
      </section>
      <section v-else-if="error">
        <p>Unable to load demos right now.</p>
      </section>
      <section v-else>
        <ul class="demo-list">
          <li v-for="demo in data?.demos || []" :key="demo.slug" class="demo-card">
            <h2><a :href="`/demos/${demo.slug}`">{{ demo.title }}</a></h2>
            <p class="demo-meta">
              <time :datetime="demo.date">{{ formatDate(demo.date) }}</time>
              <span v-if="demo.category"> • {{ demo.category }}</span>
            </p>
            <p>{{ demo.description }}</p>
            <a class="demo-link" :href="`/demos/${demo.slug}`">Run the demo</a>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
