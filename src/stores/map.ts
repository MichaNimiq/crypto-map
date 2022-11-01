import { useGeoIp } from "@/composables/useGeoIp";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { GoogleMap } from "vue3-google-map/*";
import { useApi } from "./api";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Location {
  southWest: LatLng;
  northEast: LatLng;
}

export enum AutocompleteStatus {
  LOADING = "loading",
  WITH_RESULTS = "with-results",
  NO_RESULTS = "no-results",
  ERROR = "error",
}

export const useMap = defineStore("map", () => {
  const map$ = ref<typeof GoogleMap>();
  const location = ref<Location>({
    southWest: { lat: 0, lng: 0 },
    northEast: { lat: 0, lng: 0 },
  });
  const zoom = ref(7);
  const center = ref<LatLng>({ lat: 50.5, lng: 10.5 });

  // @ts-ignore
  const map = computed(() => map$.value.map as google.maps.Map);

  async function setCenter(location?: LatLng) {
    center.value = location ? { ...location } : { ...(await useGeoIp().locate()) }
  }

  function setZoom(newZoom: number) { zoom.value = newZoom }
  function increaseZoom() { setZoom(zoom.value + 1) }
  function decreaseZoom() { setZoom(zoom.value - 1) }

  async function setBoundingBox(newLocation: Location) {
    if (!sessionToken.value) sessionToken.value = new google.maps.places.AutocompleteSessionToken()
    if (!autocompleteService.value) autocompleteService.value = new google.maps.places.AutocompleteService()

    location.value = newLocation;
    await useApi().search(location.value);
    // @ts-ignore
    center.value = map.value.getCenter().toJSON();
    // @ts-ignore
    zoom.value = map.value.getZoom();
  }

  const setBoundingBoxDebouncer = useDebounceFn(setBoundingBox, 100)

  const route = useRoute()

  function computeBoundingBox() {
    const bounds = map.value.getBounds()
    if (!bounds) return
    const { lat: neLat, lng: neLng } = bounds.getNorthEast()
    const { lat: swLat, lng: swLng } = bounds.getSouthWest()
    setBoundingBoxDebouncer({ southWest: { lat: swLat(), lng: swLng() }, northEast: { lat: neLat(), lng: neLng() } })
    // @ts-ignore
    this.router.push({ name: "coords", params: { ...center.value, zoom: zoom.value }, query: { ...route.query } })
  }

  function navigateToUserLocation() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCenter({ lat: coords.latitude, lng: coords.longitude })
      setZoom(13)
    })
  }


  // Autocomplete 
  const sessionToken = ref<google.maps.places.AutocompleteSessionToken>();
  const autocompleteService = ref<google.maps.places.AutocompleteService>();
  const autocompleteStatus = ref<AutocompleteStatus>();

  const suggestions = ref<google.maps.places.AutocompletePrediction[]>([])

  function autocomplete(input: string) {
    autocompleteStatus.value = AutocompleteStatus.LOADING
    if (!input || !autocompleteService.value) {
      autocompleteStatus.value = AutocompleteStatus.NO_RESULTS
      return suggestions.value = []
    }
    autocompleteService.value.getPlacePredictions({ input, sessionToken: sessionToken.value }, (predictions, status) => {
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
  }

  function fitBounds(bounds: google.maps.LatLngBounds) {
    map.value.fitBounds(bounds)
    center.value = map.value.getCenter()?.toJSON() || center.value
    zoom.value = map.value.getZoom() || zoom.value
  }

  return {
    map$,
    location,
    zoom,
    center,

    map,

    setCenter,
    setZoom,
    increaseZoom,
    decreaseZoom,
    setBoundingBox,
    computeBoundingBox,
    navigateToUserLocation,

    suggestions,
    autocomplete,
    autocompleteStatus,
    goToPlaceId
  }
});
