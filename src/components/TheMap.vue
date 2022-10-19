<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import LocationIcon from "@/components/icons/icon-location.vue"
import PlusIcon from "@/components/icons/icon-plus.vue"
import MinusIcon from "@/components/icons/icon-minus.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import ListIcon from "@/components/icons/icon-list.vue"
import TheMapInstance from "@/components/TheMapInstance.vue"
import { useApp } from "@/stores/app"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"
import { storeToRefs } from "pinia"

const { greater } = useBreakpoints(breakpointsTailwind)
const isXlScreen = greater("xl")

const appStore = useApp()
const { locationListVisible } = storeToRefs(appStore)
</script>

<template>
	<!-- TODO Aria with the controls -->
	<main id="map-wrapper" class="w-full" ref="mapWrapper">
		<TheMapInstance>
			<template #button-calculate-position="{ navigateToUserLocation }">
				<Button
					@click="navigateToUserLocation"
					style="width: 34px; height: 34px"
					bgColor="white"
					size="sm"
				>
					<template #icon>
						<LocationIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-in="{ zoomIn }">
				<Button
					@click="zoomIn"
					style="width: 34px; height: 34px"
					class="rounded-b-0"
					bgColor="white"
					size="sm"
				>
					<template #icon>
						<PlusIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-out="{ zoomOut }">
				<Button
					@click="zoomOut"
					style="width: 34px; height: 34px"
					class="rounded-t-0"
					bgColor="white"
					size="sm"
				>
					<template #icon>
						<MinusIcon />
					</template>
				</Button>
			</template>
		</TheMapInstance>
		<Button
			v-if="isXlScreen"
			class="absolute bottom-5 md:bottom-6 transition-all"
			:class="!locationListVisible ? 'left-5 md:left-6' : 'left-[354px] md:left-[358px]'"
			bgColor="white"
			@click="appStore.toggleLocationList()"
		>
			<template #icon>
				<component :is="locationListVisible ? ChevronLeftIcon : ListIcon" />
			</template>

			<template #text> {{ locationListVisible ? "Hide list" : "Show list" }} </template>
		</Button>

		<Button
			v-if="isXlScreen"
			class="absolute bottom-5 md:bottom-6 right-5 md:right-6"
			bgColor="white"
			href="/location/add"
		>
			<template #text> Add crypto location </template>
		</Button>
	</main>
</template>

<!-- It is not scoped because we want to apply the popup styles for now -->
<!-- TODO Move popup styles somewhere else and change this to scoped css -->
<style lang="scss">
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";

#map-wrapper {
	position: relative;
	height: 100%;
	transition: flex-basis $transition ease;
	border-radius: 0px;

	@include media("small") {
		flex-grow: 1;
		flex-shrink: 0;
		height: unset;
		width: unset;
	}
}
</style>
