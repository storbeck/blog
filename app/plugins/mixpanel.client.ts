import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = '4ba463d581f794dcf1a6da2690508d33'

export default defineNuxtPlugin(() => {
  mixpanel.init(MIXPANEL_TOKEN, {
    autocapture: {
      pageview: 'full-url',
      click: true,
      dead_click: true,
      input: true,
      rage_click: true,
      scroll: true,
      submit: true
    },
    track_pageview: 'full-url',
    record_sessions_percent: 100,
    record_heatmap_data: true,
    persistence: 'localStorage',
    debug: true,
    ignore_dnt: true,
    loaded: () => {
      console.info('[mixpanel] loaded')
    }
  })

  mixpanel.track('mp_boot_test', {
    path: window.location.pathname,
    host: window.location.host
  })
})
