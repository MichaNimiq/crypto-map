<script setup lang="ts">
import googleMapStyles from "@/assets/google-map-styles"
import CategoryIcon from "@/components/elements/CategoryIcon.vue"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { useMap } from "@/stores/map"
import { Cluster, SuperClusterAlgorithm } from "@googlemaps/markerclusterer"
import { useDebounceFn } from "@vueuse/shared"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { CustomMarker, GoogleMap, MarkerCluster } from "vue3-google-map"

const apiStore = useApi()
const { establishmentsInView } = storeToRefs(apiStore)

const appStore = useApp()
const { goToPlaceId } = appStore
const { selectedEstablishmentId } = storeToRefs(appStore)

const mapStore = useMap()
const {
	navigateToUserLocation,
	increaseZoom,
	decreaseZoom,
	setCenter,
	setZoom,
	computeBoundingBox,
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

const debouncer = useDebounceFn(computeBoundingBox, 2000)

// We have to wait until GoogleMap component is mounted in order to compute
// the bounding box of the map if user is accessing the map from an establishment
function onIdle() {
	const { place_id: placeId } = route.params
	const placeIdOk = placeId && typeof placeId === "string"
	if (placeIdOk) {
		goToPlaceId(placeId)
	} else {
		debouncer()
	}
}

const superClusterAlgorithm = new SuperClusterAlgorithm({ radius: 160, maxZoom: 16 }) as unknown as undefined // To avoid lint error
const render = (cluster: Cluster) => {
	return new google.maps.Marker({
		position: cluster.position,
		label: {
			text: String(cluster.markers?.length || 0),
			color: "white",
			fontWeight: "bold",
		},
		icon: "/img/cluster.png",
	})
}
</script>

<template>
	<GoogleMap v-if="center.lat !== 0 && center.lng !== 0" ref="map$" :api-key="googleMapsKey" class="w-full h-full"
		:center="center" :zoom="zoom" disable-default-ui :clickable-icons="false" :styles="googleMapStyles"
		@dragend="computeBoundingBox" @zoom_changed="computeBoundingBox" @idle="onIdle">
		<MarkerCluster :options="{ algorithm: superClusterAlgorithm, renderer: { render } }">
			<CustomMarker ref="markers$" v-for="[, establishment] in establishmentsInView" :key="establishment.id"
				:options="{ position: establishment.geoLocation, anchorPoint: 'TOP_CENTER' }">
				<RouterLink :to="`/establishment/${establishment.id}`" @click="appStore.showList"
					class="flex flex-col items-center shadow cursor-pointer rounded-full">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="10" viewBox="0 0 28 10" :class="{
						'text-space': establishment.id !== selectedEstablishmentId,
						'text-ocean': establishment.id === selectedEstablishmentId,
					}">
						<path fill="currentColor"
							d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z" />
					</svg>

					<div class="rounded-full flex gap-x-3 items-center pl-1 pr-4 py-[5px]" :class="{
						'bg-gradient-space': establishment.id !== selectedEstablishmentId,
						'bg-ocean': establishment.id === selectedEstablishmentId,
					}">
						<CategoryIcon class="h-8 w-8 p-0.5 bg-white rounded-full grid place-items-center"
							:category="establishment.category" />
						<div style="font-size: 1.125rem" class="text-white">{{ establishment.name }}</div>
					</div>
				</RouterLink>
			</CustomMarker>
		</MarkerCluster>
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
