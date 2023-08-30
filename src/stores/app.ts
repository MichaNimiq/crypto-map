import { useRouteQuery } from '@vueuse/router'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { CATEGORIES, CURRENCIES } from '@/database'
import { useLocations } from '@/stores/locations'
import { useMap } from '@/stores/map'
import type { Category, Currency } from '@/types'

export const useApp = defineStore('app', () => {
  const selectedCategoriesQuery = useRouteQuery<Category | Category[]>('categories')
  const selectedCategories = computed(() => {
    const c = selectedCategoriesQuery.value
    if (!c)
      return []
    const categoriesArray = Array.isArray(c) ? c : [c]
    return categoriesArray.filter(category => CATEGORIES.includes(category))
  })
  const selectedCurrenciesQuery = useRouteQuery<Currency | Currency[]>('currencies')
  const selectedCurrencies = computed(() => {
    const c = selectedCurrenciesQuery.value
    if (!c)
      return []
    const currenciesArray = Array.isArray(c) ? c : [c]
    return currenciesArray.filter(currency => CURRENCIES.includes(currency))
  })

  function setSelectedCurrencies(currencies: Currency[]) {
    selectedCurrenciesQuery.value = currencies
  }

  function setSelectedCategories(categories: Category[]) {
    selectedCategoriesQuery.value = categories
  }

  async function goToLocation(uuid: string) {
    const location = await useLocations().getLocationByUuid(uuid)
    if (!location)
      return false

    useMap().setPosition({
      center: { lat: location.lat, lng: location.lng },
      zoom: 19,
    })

    return true
  }

  return {
    goToLocation,
    selectedCategories,
    selectedCurrencies,
    setSelectedCurrencies,
    setSelectedCategories,
  }
})
