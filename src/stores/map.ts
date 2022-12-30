import type { IpLocation } from "@/composables/useGeoIp";
import { useGeoIp } from "@/composables/useGeoIp";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { GoogleMap } from "vue3-google-map/*";
import { useApp } from "./app";
import { useEstablishments } from "./establishments";

export interface Point {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  southWest: Point;
  northEast: Point;
}

export const SANTA_TERESA_VIEW: IpLocation = { location: { lat: 9.6375821, lng: -85.1691914 }, zoom: 13 }
export const COSTA_RICA_VIEW: IpLocation = { location: { lat: 9.832213439337215, lng: -84.19869984449741 }, zoom: 9 }

function parseParams({ lat, lng, zoom: zoomLevel, uuid }: Record<string, string | string[]>) {
  const latOk = lat && typeof lat === "string" && !isNaN(Number(lat))
  const lngOk = lng && typeof lng === "string" && !isNaN(Number(lng))
  const zoomOk = zoomLevel && typeof zoomLevel === "string" && !isNaN(Number(zoomLevel))
  const uuidOk = uuid && typeof uuid === "string" && uuid.length > 0

  return {
    lat: latOk ? Number(lat) : undefined,
    lng: lngOk ? Number(lng) : undefined,
    zoomLevel: zoomOk ? Number(zoomLevel) : undefined,
    uuid: uuidOk ? uuid : undefined
  }
}

export const useMap = defineStore("map", () => {
  const map$ = ref<typeof GoogleMap>();
  const mapReady = computed(() => !!map$.value);

  const zoom = ref(7);
  const center = ref<Point>();

  const map = computed(() => map$.value ? map$.value.map as google.maps.Map : null);

  const boundingBox = ref<BoundingBox>({
    southWest: { lat: 0, lng: 0 },
    northEast: { lat: 0, lng: 0 },
  });
  // See more info in establishments store
  // the more zoom in, the bigger the radius we want to search, but not so much
  const scaleFactor = computed(() => zoom.value / 2);
  const surroundingBoundingBox = computed(() => {
    const { northEast, southWest } = boundingBox.value
    const newBoundingBox = {
      northEast: {
        lat: northEast.lat + (northEast.lat - southWest.lat) * scaleFactor.value,
        lng: northEast.lng + (northEast.lng - southWest.lng) * scaleFactor.value,
      },
      southWest: {
        lat: southWest.lat - (northEast.lat - southWest.lat) * scaleFactor.value,
        lng: southWest.lng - (northEast.lng - southWest.lng) * scaleFactor.value,
      }
    }
    return newBoundingBox
  })

  async function setCenter(geoLocation: Point) {
    center.value = { ...geoLocation }
  }

  function setZoom(newZoom: number) { zoom.value = newZoom }
  function increaseZoom() { setZoom(zoom.value + 1) }
  function decreaseZoom() { setZoom(zoom.value - 1) }

  async function setBoundingBox(newBoundingBox: BoundingBox) {
    boundingBox.value = newBoundingBox;

    if (!map.value) return

    const mapCenter = map.value.getCenter()
    const mapZoom = map.value.getZoom()

    if (mapCenter) center.value = mapCenter.toJSON()
    if (mapZoom) zoom.value = mapZoom
  }

  const setBoundingBoxDebouncer = useDebounceFn(setBoundingBox, 100)

  const route = useRoute()
  const router = useRouter()

  watch(route, async () => useApp().goToEstablishment(route.params.uuid as string))

  function computeBoundingBox({ updateRoute } = { updateRoute: true }) {
    if (!map.value) return

    const bounds = map.value.getBounds()
    if (!bounds) return

    const { lat: neLat, lng: neLng } = bounds.getNorthEast()
    const { lat: swLat, lng: swLng } = bounds.getSouthWest()

    setBoundingBoxDebouncer({ southWest: { lat: swLat(), lng: swLng() }, northEast: { lat: neLat(), lng: neLng() } })

    useEstablishments().hideNearby()

    if (updateRoute) {
      router.push({ name: "coords", params: { ...center.value, zoom: zoom.value }, query: { ...route.query } })
    }
  }

  function navigateToUserLocation() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCenter({ lat: coords.latitude, lng: coords.longitude })
      setZoom(13)
    })
  }

  function fitBounds(bounds: google.maps.LatLngBounds) {
    if (!map.value) return;

    map.value.fitBounds(bounds)
    center.value = map.value.getCenter()?.toJSON() || center.value
    zoom.value = map.value.getZoom() || zoom.value
  }

  onMounted(async () => {
    const { lat, lng, zoomLevel, uuid } = parseParams(route.params)

    if (lat && lng && zoomLevel) {
      setCenter({ lat: Number(lat), lng: Number(lng) })
      setZoom(Number(zoomLevel))
      return
    } else if (uuid) {
      const mapMoved = await useApp().goToEstablishment(uuid)
      if (mapMoved) {
        return
      }
    }

    // Fallback to user location or Santa Teresa
    // const geoLocation = await useGeoIp().locate().catch(() => {
    //   return SANTA_TERESA_VIEW
    // })

    // Fallback to Costa Rica for now
    setCenter(COSTA_RICA_VIEW.location)
    setZoom(COSTA_RICA_VIEW.zoom)
  })

  return {
    map$,
    boundingBox,
    surroundingBoundingBox,
    zoom,
    center,

    map,
    mapReady,

    setCenter,
    setZoom,
    increaseZoom,
    decreaseZoom,
    setBoundingBox,
    computeBoundingBox,
    fitBounds,
    navigateToUserLocation
  }
});
