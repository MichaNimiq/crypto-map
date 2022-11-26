import { defineStore, storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMap } from "./map";

export enum AutocompleteStatus {
  LOADING = "loading",
  WITH_RESULTS = "with-results",
  NO_RESULTS = "no-results",
  ERROR = "error",
}

export const useApp = defineStore("app", () => {
  const listIsShown = ref(false);
  const toggleList = () => listIsShown.value = !listIsShown.value;
  const showList = () => listIsShown.value = true;
  const hideList = () => listIsShown.value = false;

  const selectedEstablishmentId = ref<number>();

  const route = useRoute();
  watch(route, () => {
    if (route.name === "establishment_detail") {
      selectedEstablishmentId.value = Number(route.params.id);
    }
  });

  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>();
  const autocompleteService = ref<google.maps.places.AutocompleteService>();
  const autocompleteStatus = ref<AutocompleteStatus>();

  const suggestions = ref<google.maps.places.AutocompletePrediction[]>([])

  const mapStore = useMap();
  const { fitBounds, computeBoundingBox } = mapStore;
  const { map, mapReady } = storeToRefs(mapStore);

  async function autocomplete(input: string, types?: string[]) {
    if (!sessionToken.value) sessionToken.value = new google.maps.places.AutocompleteSessionToken()
    if (!autocompleteService.value) autocompleteService.value = new google.maps.places.AutocompleteService()

    autocompleteStatus.value = AutocompleteStatus.LOADING
    if (!input || !autocompleteService.value) {
      autocompleteStatus.value = AutocompleteStatus.NO_RESULTS
      return suggestions.value = []
    }
    autocompleteService.value.getPlacePredictions({
      input,
      sessionToken: sessionToken.value,
      location: mapReady.value ? map.value.getCenter() : undefined,
      bounds: mapReady.value ? map.value.getBounds() : undefined,
      types
    }, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        autocompleteStatus.value = AutocompleteStatus.ERROR
        return
      }

      suggestions.value = predictions || []
      autocompleteStatus.value = suggestions.value.length > 0 ? AutocompleteStatus.WITH_RESULTS : AutocompleteStatus.NO_RESULTS
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
    listIsShown,
    toggleList,
    showList,
    hideList,
    selectedEstablishmentId: selectedEstablishmentId,

    suggestions,
    autocomplete,
    autocompleteStatus,
    goToPlaceId,
  }
});
