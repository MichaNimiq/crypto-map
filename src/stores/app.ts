import { getTimestamps } from 'database'
import { defineStore, storeToRefs } from 'pinia'
import type { AnyUserReadDbFunction, Returns } from 'types'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMarkers } from '@/stores/markers'
import { DATABASE_ARGS } from '@/shared'
import { useCaptcha } from '@/composables/useCaptcha'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useApp = defineStore('app', () => {
  // We just track the first load, so we can show a loading indicator
  const isListShown = ref(false)
  const mapLoaded = ref(false)

  const route = useRoute()

  const { loaded: markersLoaded } = storeToRefs(useMarkers())

  const until = Date.now() + 300 // Show the splash screen at least for 200ms
  const showSplashScreen = ref(true)
  watch([mapLoaded, markersLoaded], () => {
    if (mapLoaded.value && markersLoaded.value) {
      setTimeout(() => {
        showSplashScreen.value = false

        // FIXME It would be better to use another method to open the location card
        // Open location card if UUID is in the URL
        if (route.query.uuid)
          sleep(1000).then(() => (document.querySelector(`[data-trigger-uuid="${route.query.uuid}"]`) as HTMLElement)?.click())
      }, Math.max(0, until - Date.now()))
    }
  })

  // We track if the user has hidden the search box hint using localStorage
  const shouldShowSearchBoxHint = ref(!localStorage.getItem('hideSearchBoxHint'))
  document.documentElement.style.setProperty('--search-box-hint', shouldShowSearchBoxHint.value ? '1' : '0')
  function hideSearchBoxHint() {
    localStorage.setItem('hideSearchBoxHint', 'true')
    shouldShowSearchBoxHint.value = false
    document.documentElement.style.setProperty('--search-box-hint', '0')
  }

  const timestamps = ref<Returns[AnyUserReadDbFunction.GetTimestamps]>()

  const { init: initCaptcha, captchaToken } = useCaptcha()
  async function init() {
    if (captchaToken.value && timestamps.value)
      return
    const [_, newTimestamps] = await Promise.allSettled([initCaptcha(), getTimestamps(DATABASE_ARGS)])
    timestamps.value = newTimestamps.status === 'fulfilled' ? newTimestamps.value : undefined
  }

  init()

  return {
    isListShown,
    shouldShowSearchBoxHint,
    hideSearchBoxHint,
    mapLoaded,
    showSplashScreen,
    timestamps,
    init,
    captchaToken,
  }
})
