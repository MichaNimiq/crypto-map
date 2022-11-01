<script setup lang="ts">
import googleMapStyles from "@/assets/google-map-styles"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { useMap } from "@/stores/map"
import { onClickOutside } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { CustomMarker, GoogleMap } from "vue3-google-map"

const apiStore = useApi()
const { cryptoLocations } = storeToRefs(apiStore)

const appStore = useApp()
const { selectedLocationId } = storeToRefs(appStore)

const mapStore = useMap()
const {
	navigateToUserLocation,
	increaseZoom,
	decreaseZoom,
	setCenter,
	setZoom,
	computeBoundingBox,
	goToPlaceId,
} = mapStore
const { center, zoom, map$ } = storeToRefs(mapStore)

const route = useRoute()

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAP_KEY

const markers$ = ref<typeof CustomMarker[]>([])

onMounted(async () => {
	const { lat, lng, zoom: zoomLevel } = route.params
	const latOk = lat && typeof lat === "string" && !isNaN(Number(lat))
	const lngOk = lng && typeof lng === "string" && !isNaN(Number(lng))
	const zoomOk = zoomLevel && typeof zoomLevel === "string" && !isNaN(Number(zoomLevel))
	if (latOk && lngOk && zoomOk) {
		setCenter({ lat: Number(lat), lng: Number(lng) })
		setZoom(Number(zoomLevel))
	} else {
		navigateToUserLocation()
	}
})

// We have to wait until GoogleMap component is mounted in order to compute
// the bounding box of the map if user is accessing the map from a location
function onIdle() {
	const { place_id: placeId } = route.params
	const placeIdOk = placeId && typeof placeId === "string"
	if (placeIdOk) {
		goToPlaceId(placeId)
	} else {
		computeBoundingBox()
	}
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
		@zoom_changed="computeBoundingBox"
		@idle="onIdle"
	>
		<CustomMarker
			ref="markers$"
			v-for="location in cryptoLocations"
			:key="location.placeId"
			:options="{ position: location.geoLocation, anchorPoint: 'TOP_CENTER' }"
		>
			<RouterLink
				:to="`/location/${location.placeId}`"
				class="flex flex-col items-center shadow-location-popup cursor-pointer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="28"
					height="10"
					viewBox="0 0 28 10"
					:class="{
						'text-space': location.placeId !== selectedLocationId,
						'text-ocean': location.placeId === selectedLocationId,
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
						'bg-radial-space': location.placeId !== selectedLocationId,
						'bg-ocean': location.placeId === selectedLocationId,
					}"
				>
					<div class="h-8 w-8 bg-white rounded-full p-2 grid place-items-center">I</div>
					<div style="font-size: 1.125rem" class="text-white">{{ location.name }}</div>
				</div>
			</RouterLink>
		</CustomMarker>
	</GoogleMap>

	<div class="absolute top-5 right-5 md:top-6 md:right-6 flex flex-col gap-y-4 children:shadow">
		<slot name="button-calculate-position" :navigateToUserLocation="navigateToUserLocation" />

		<div class="flex flex-col bg-white rounded-full">
			<slot name="button-zoom-in" :zoomIn="increaseZoom" />

			<hr class="bg-space/10 h-px self-stretch" />

			<slot name="button-zoom-out" :zoomOut="decreaseZoom" />
		</div>
	</div>
</template>
