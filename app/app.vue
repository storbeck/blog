<script setup lang="ts">
const theme = useState<'light' | 'dark'>('theme', () => 'light')

const applyTheme = (value: 'light' | 'dark') => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('theme-dark', value === 'dark')
  document.documentElement.style.colorScheme = value === 'dark' ? 'dark' : 'light'
}

onMounted(() => {
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
