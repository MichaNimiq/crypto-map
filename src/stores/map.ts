import { useGeoIp } from "@/composables/useGeoIp";
import { useDebounceFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { GoogleMap } from "vue3-google-map/*";
import { useApp } from "./app";

export interface Point {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  southWest: Point;
  northEast: Point;
}

function parseParams({ lat, lng, zoom: zoomLevel, id: establishmentId }: Record<string, string | string[]>) {
  const latOk = lat && typeof lat === "string" && !isNaN(Number(lat))
  const lngOk = lng && typeof lng === "string" && !isNaN(Number(lng))
  const zoomOk = zoomLevel && typeof zoomLevel === "string" && !isNaN(Number(zoomLevel))
  const establishmentIdOk = establishmentId && typeof establishmentId === "string" && !isNaN(Number(establishmentId))

  return {
    lat: latOk ? Number(lat) : undefined,
    lng: lngOk ? Number(lng) : undefined,
    zoomLevel: zoomOk ? Number(zoomLevel) : undefined,
    establishmentId: establishmentIdOk ? Number(establishmentId) : undefined,
  }
}

export const useMap = defineStore("map", () => {
  const map$ = ref<typeof GoogleMap>();
  const mapReady = computed(() => !!map$.value);

  const boundingBox = ref<BoundingBox>({
    southWest: { lat: 0, lng: 0 },
    northEast: { lat: 0, lng: 0 },
  });
  const zoom = ref(7);
  const center = ref<Point>();

  const map = computed(() => map$.value ? map$.value.map as google.maps.Map : null);

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

  function computeBoundingBox({ updateRoute } = { updateRoute: true }) {
    if (!map.value) return

    const bounds = map.value.getBounds()
    if (!bounds) return

    const { lat: neLat, lng: neLng } = bounds.getNorthEast()
    const { lat: swLat, lng: swLng } = bounds.getSouthWest()

    setBoundingBoxDebouncer({ southWest: { lat: swLat(), lng: swLng() }, northEast: { lat: neLat(), lng: neLng() } })

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
    const { lat, lng, zoomLevel, establishmentId } = parseParams(route.params)

    if (lat && lng && zoomLevel) {
      setCenter({ lat: Number(lat), lng: Number(lng) })
      setZoom(Number(zoomLevel))
      return
    } else if (establishmentId) {
      const mapMoved = await useApp().goToEstablishment(establishmentId)
      if (mapMoved) {
        return
      }
    }

    // Fallback to user location
    useGeoIp().locate()
    navigateToUserLocation()
  })

  return {
    map$,
    boundingBox,
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
