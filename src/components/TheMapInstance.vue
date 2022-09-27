<script setup lang="ts">
import googleMapStyles from "@/assets/google-map-styles"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { useMap, type LatLng, type MapPosition } from "@/stores/map"
import { useGeoIp } from "@/composables/useGeoIp"
import { useDebounceFn } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { CustomMarker, GoogleMap } from "vue3-google-map"

const map$ = ref<typeof GoogleMap>()

const center = ref({ lat: 0, lng: 0 })
const zoom = ref(7)

const apiStore = useApi()
const { locations } = storeToRefs(apiStore)

const appStore = useApp()
const { selectedLocation } = storeToRefs(appStore)

const { setBoundingBox } = useMap()

const router = useRouter()
const route = useRoute()

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAP_KEY

onMounted(async () => {
	const { lat, lng, zoom: zoomLevel } = route.params
	if (
		lat &&
		typeof lat === "string" &&
		lng &&
		typeof lng === "string" &&
		zoomLevel &&
		typeof zoomLevel === "string"
	) {
		setCenter({ lat: Number(lat), lng: Number(lng) })
		zoom.value = Number(zoomLevel)
	} else {
		setCenter()
		zoom.value = 7
	}
})

const setBoundingBoxDebouncer = useDebounceFn(setBoundingBox, 100)

function computeBoundingBox() {
	const bounds = (map$.value as any).map.getBounds()
	const sw = bounds.getSouthWest()
	const ne = bounds.getNorthEast()
	const boundingBox = { swLng: sw.lng(), swLat: sw.lat(), neLng: ne.lng(), neLat: ne.lat() }
	setBoundingBoxDebouncer(boundingBox)
	setRoute()
}

async function setCenter(location?: LatLng) {
	center.value = location ? { ...location } : { ...(await useGeoIp().locate()) }
}

function getMapInstance() {
	return (map$.value as any).map
}

function getPosition() {
	return {
		zoomLevel: getMapInstance().getZoom(),
		...(getMapInstance().getCenter().toJSON() as { lat: number; lng: number }),
	}
}

function setZoom(zoomLevel: number) {
	getMapInstance().setZoom(zoomLevel)
}

function getUserLocation() {
	if (!navigator.geolocation) return

	navigator.geolocation.getCurrentPosition(({ coords }) => {
		getMapInstance().setCenter({ lat: coords.latitude, lng: coords.longitude })
		getMapInstance().setZoom(15)
	})
}

function setRoute() {
	const { zoomLevel: zoom, lat, lng } = getPosition()
	router.push({ name: "coords", params: { lat, lng, zoom } })
}
</script>

<template>
	<GoogleMap
		v-if="center.lat !== 0 && center.lng !== 0"
		ref="map$"
		:api-key="googleMapsKey"
		class="w-full h-full"
		:center="center"
		:zoom="zoom"
		disable-default-ui
		:clickable-icons="false"
		:styles="googleMapStyles"
		@dragend="computeBoundingBox"
		@idle="computeBoundingBox"
	>
		<CustomMarker
			v-for="location in locations"
			:key="location.id"
			:options="{ position: location.geo_location, anchorPoint: 'TOP_CENTER' }"
		>
			<RouterLink
				:to="`/location/${location.id}`"
				class="flex flex-col items-center shadow-location-popup cursor-pointer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="28"
					height="10"
					viewBox="0 0 28 10"
					:class="{
						'text-space': location.id !== selectedLocation,
						'text-ocean': location.id === selectedLocation,
					}"
				>
					<path
						fill="currentColor"
						d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
					/>
				</svg>

				<div
					class="rounded-full flex gap-x-3 items-center pl-1 pr-4 py-[5px]"
					:class="{
						'bg-location-popup': location.id !== selectedLocation,
						'bg-ocean': location.id === selectedLocation,
					}"
				>
					<div class="h-8 w-8 bg-white rounded-full p-2 grid place-items-center">I</div>
					<div style="font-size: 1.125rem" class="text-white">{{ location.name }}</div>
				</div>
			</RouterLink>
		</CustomMarker>
	</GoogleMap>

	<div class="absolute top-5 right-5 md:top-6 md:right-6 flex flex-col gap-y-4">
		<slot name="button-calculate-position" :getUserLocation="getUserLocation" />

		<div class="flex flex-col bg-white rounded-full">
			<slot name="button-zoom-in" :zoomIn="() => setZoom(getPosition().zoomLevel + 1)" />

			<hr class="bg-space/10 h-px self-stretch" />

			<slot name="button-zoom-out" :zoomOut="() => setZoom(getPosition().zoomLevel - 1)" />
		</div>
	</div>
</template>
