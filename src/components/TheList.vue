<script setup lang="ts">
import LocationCard from "@/components/elements/LocationCard.vue"
import CactusIcon from "@/components/icons/icon-cactus.vue"
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
	<div
		class="bg-white inset-x-0 lg:right-unset w-screen lg:w-max flex"
		:style="containerBottomStyle"
	>
		<ul
			v-if="cryptoLocations.length > 0"
			ref="scroller$"
			class="scroll-space p-6 h-full flex flex-row flex-wrap overflow-auto lg:flex-nowrap items-stretch lg:flex-col gap-6 lg:snap-y lg:snap-mandatory scroll-py-6 transition-transform"
			:class="{
				'lg:-translate-x-full': !locationListVisible,
			}"
		>
			<li
				class="list-item-wrap lg:snap-start flex-1"
				v-for="location in cryptoLocations"
				:key="location.id"
			>
				<LocationCard :location="location" />
			</li>
		</ul>
		<div v-else class="grid place-content-center max-w-[25ch] p-6">
			<CactusIcon />
			<p class="text-space text-center">Oops, no businesses around here</p>
		</div>
	</div>
</template>
