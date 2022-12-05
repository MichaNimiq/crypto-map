import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import type { Suggestion } from "./api";
import { useMap } from "./map";

export enum AutocompleteStatus {
  LOADING = "loading",
  WITH_RESULTS = "with-results",
  NO_RESULTS = "no-results",
  ERROR = "error",
}

export const useGoogle = defineStore("google", () => {
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>();
  const autocompleteService = ref<google.maps.places.AutocompleteService>();

  const suggestions = ref<Suggestion[]>([])

  const mapStore = useMap();
  const { fitBounds, computeBoundingBox } = mapStore;
  const { map, mapReady } = storeToRefs(mapStore);

  async function autocomplete(input: string, types?: string[]) {
    if (!sessionToken.value) sessionToken.value = new google.maps.places.AutocompleteSessionToken()
    if (!autocompleteService.value) autocompleteService.value = new google.maps.places.AutocompleteService()

    if (!input || !autocompleteService.value) {
      return suggestions.value = []
    }
    await autocompleteService.value.getPlacePredictions({
      input,
      sessionToken: sessionToken.value,
      location: mapReady.value && map.value ? map.value.getCenter() : undefined,
      bounds: mapReady.value && map.value ? map.value.getBounds() : undefined,
      types
    }, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
        return
      }
      suggestions.value = predictions.map(p => ({
        id: p.place_id,
        label: p.description,
        source: 'googleEstablishment',
        matchedSubstrings: p.matched_substrings,
        onclick: () => {
          goToPlaceId(p.place_id)
        }
      }))
    })
  }

  async function goToPlaceId(placeId?: string) {
    const geocoder = new google.maps.Geocoder();
    if (!placeId) return
    const res = await geocoder.geocode({ placeId })
    if (res.results.length === 0) return
    fitBounds(res.results[0].geometry.viewport)
    computeBoundingBox()
  }

  return {
    suggestions,
    autocomplete,
    goToPlaceId,
  }
});
