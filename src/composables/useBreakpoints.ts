import { useBreakpoints as _useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'

const breakpoints = {
  '2xs': 360,
  xs: 420,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1152,
  '2xl': 1440,
}

export function useBreakpoints() {
  const useBreakpoints = _useBreakpoints(breakpoints)
  const smallScreen = useBreakpoints.smaller('sm')
  const largeScreen = useBreakpoints.greater('lg')
  const xlScreen = useBreakpoints.greater('xl')
  const mediumScreen = computed(() => !smallScreen.value && !largeScreen.value) // Using useBreakpoints.between('sm', 'lg') doesn't work
  return { ...useBreakpoints, smallScreen, mediumScreen, largeScreen, xlScreen }
}