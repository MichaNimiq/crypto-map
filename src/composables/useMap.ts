import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { GoogleMap } from 'vue3-google-map/*'

export interface Point {
  lat: number
  lng: number
}

export interface EstimatedPosition {
  center: Point
  accuracy: number // in meters
}

export interface Position {
  center: Point
  zoom: number
}

// Costa Rica
export const FALLBACK_POSITION: Position = { center: { lat: 9.832213439337215, lng: -84.19869984449741 }, zoom: 9 }

export function useMap() {
  const map$ = ref<typeof GoogleMap>()
  const mapReady = computed(() => !!map$?.value)
  const map = computed(() => map$?.value ? map$?.value.map as google.maps.Map : undefined)

  function setPosition(p?: Position | EstimatedPosition | google.maps.LatLngBounds) {
    if (!map.value || !p)
      return

    if ('zoom' in p) {
      map.value.setCenter(p.center)
      map.value.setZoom(p.zoom)
    }
    else if ('accuracy' in p) {
      const circle = new google.maps.Circle({
        center: p.center,
        radius: p.accuracy,
      })
      map.value.fitBounds(circle.getBounds()!)
    }
    else if (p instanceof google.maps.LatLngBounds) {
      map.value.fitBounds(p)
    }
  }

  /**
   * When user loads the map:
   *  1. If the user is at /lat,lng,zoom -> We load the user's location from the URL
   *  2. If the user is at / -> We load the user's location from the IP address using Nimiq Geolocation API
   *  3. Otherwise, we use FALLBACK_POSITION
   */
  const { params: p } = useRoute()
  async function setInitialPosition() {
    const validFloat = (n?: string | string[]) => !!n && typeof n === 'string' && !Number.isNaN(Number(n))
    if (validFloat(p.lat) && validFloat(p.lng) && validFloat(p.zoom)) {
      setPosition({ center: { lat: Number(p.lat), lng: Number(p.lng) }, zoom: Number(p.zoom) })
    }
    else {
      const { useGeoIp } = await import('@/composables/useGeoLocation')
      const { geolocateIp, ipPosition, errorBrowser } = useGeoIp()
      await geolocateIp()
      if (!errorBrowser.value) {
        setPosition(ipPosition.value)
      }
      else {
        setPosition(FALLBACK_POSITION)
        console.warn(`Error getting user's location: ${errorBrowser.value}. Using fallback position. ${FALLBACK_POSITION}`)
      }
    }
  }

  const center = () => map.value?.getCenter()?.toJSON() as Point
  const zoom = () => map.value?.getZoom() as number
  const mapHasPosition = () => !!center() && !!zoom()
  const increaseZoom = () => map.value?.setZoom(zoom() + 1)
  const decreaseZoom = () => map.value?.setZoom(zoom() - 1)
  const bounds = () => map.value?.getBounds() as google.maps.LatLngBounds
  const boundingBox = () => {
    if (!mapReady.value)
      return
    return {
      southWest: { lat: bounds().getSouthWest().lat(), lng: bounds().getSouthWest().lng() },
      northEast: { lat: bounds().getNorthEast().lat(), lng: bounds().getNorthEast().lng() },
    }
  }

  async function goToPlaceId(placeId?: string) {
    const geocoder = new google.maps.Geocoder()
    if (!placeId)
      return
    const res = await geocoder.geocode({ placeId })
    setPosition(res.results[0]?.geometry.viewport)
  }

  return {
    map$,
    mapReady,

    setInitialPosition,
    setPosition,

    boundingBox,
    center,
    zoom,
    mapHasPosition,
    decreaseZoom,
    increaseZoom,

    goToPlaceId,
  }
}