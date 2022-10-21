<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import LocationCard from "@/components/elements/LocationCard.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import CactusIcon from "@/components/icons/icon-cactus.vue"
import ListIcon from "@/components/icons/icon-list.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { useScroll, useWindowSize } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { ref, watch } from "vue"

const { largeScreen } = useBreakpoints()

const HEADER_HEIGHT = 88
const MIN_HEIGHT = 260
const scroller$ = ref<HTMLDivElement>()
const containerBottomStyle = ref({
	bottom: "unset",
	height: largeScreen.value ? `calc(100%-${HEADER_HEIGHT})` : `${MIN_HEIGHT}px`,
})
const { y } = useScroll(scroller$)

const { height: windowHeight } = useWindowSize()

watch(
	[y, windowHeight, largeScreen],
	([y, windowHeight]) => {
		if (largeScreen.value) {
			containerBottomStyle.value = { bottom: "unset", height: "100%" }
		} else {
			const maxHeight = windowHeight - HEADER_HEIGHT
			const minHeight = windowHeight - HEADER_HEIGHT - MIN_HEIGHT

			const height = Math.min(windowHeight - minHeight + y, maxHeight)
			const bottom = Math.max(0, -height)
			containerBottomStyle.value = { height: `${height}px`, bottom: `${bottom}px` }
		}
	},
	{ immediate: true }
)

const appStore = useApp()
const { locationListVisible, selectedLocation } = storeToRefs(appStore)

const apiStore = useApi()
const { cryptoLocations } = storeToRefs(apiStore)

watch(selectedLocation, (id) => {
	if (!id) return
	const i = cryptoLocations.value.map((l) => l.id).indexOf(id)
	slideTo(i)
})

function slideTo(index: number, behavior: "smooth" | "auto" = "smooth") {
	if (!scroller$.value) return
	scroller$.value.scrollTo({
		top: (scroller$.value.querySelectorAll("li")[index] as HTMLElement)?.offsetTop || 0,
		left: 0,
		behavior,
	})
}
</script>

<template>
	<div :style="containerBottomStyle" class="flex gap-x-6">
		<ul
			ref="scroller$"
			class="scroll-space p-6 h-full flex flex-row flex-wrap overflow-auto lg:flex-nowrap items-stretch lg:flex-col gap-6 lg:snap-y lg:snap-mandatory scroll-py-6 w-96 bg-white"
			v-if="cryptoLocations.length > 0"
		>
			<li
				class="list-item-wrap lg:snap-start flex-1"
				v-for="location in cryptoLocations"
				:key="location.id"
			>
				<LocationCard :location="location" />
			</li>
		</ul>

		<div v-else class="grid place-content-center p-6 w-96 bg-white items-center gap-6">
			<CactusIcon class="text-space w-20 justify-self-center" />
			<p class="text-space text-center text-base lg:text-lg">Oops, no businesses around here</p>
		</div>

		<Button bgColor="white" class="self-end mb-5" @click="appStore.toggleLocationList()">
			<template #icon>
				<component :is="locationListVisible ? ChevronLeftIcon : ListIcon" />
			</template>

			<template #text> {{ locationListVisible ? "Hide list" : "Show list" }} </template>
		</Button>
	</div>
</template>
