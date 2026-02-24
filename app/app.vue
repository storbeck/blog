<script setup lang="ts">
import mixpanel from "mixpanel-browser";

const theme = useState<'light' | 'dark'>('theme', () => 'light')

const applyTheme = (value: 'light' | 'dark') => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('theme-dark', value === 'dark')
  document.documentElement.style.colorScheme = value === 'dark' ? 'dark' : 'light'
}

onMounted(() => {
  // Create an instance of the Mixpanel object, your token is already added to this snippet
  mixpanel.init('4ba463d581f794dcf1a6da2690508d33', {
    autocapture: true,
    record_sessions_percent: 100,
  })

  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    theme.value = stored
  }
  applyTheme(theme.value)
})

watch(theme, (value) => {
  if (!import.meta.client) return
  localStorage.setItem('theme', value)
  applyTheme(value)
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
