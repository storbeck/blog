<script setup lang="ts">
const theme = useState<'light' | 'dark'>('theme', () => 'light')
const key = '410811654d7b6c96935c8497edf146c4'

const applyTheme = (value: 'light' | 'dark') => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('theme-dark', value === 'dark')
  document.documentElement.style.colorScheme = value === 'dark' ? 'dark' : 'light'
}

onMounted(async () => {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    theme.value = stored
  }
  applyTheme(theme.value)
  const { default: Survicate } = await import('@survicate/survicate-web-package/survicate_widget')
  Survicate.init({ workspaceKey: key })
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
