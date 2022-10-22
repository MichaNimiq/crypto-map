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

const { smallScreen, largeScreen, smaller } = useBreakpoints()
const notXlScreen = smaller("xl")

const HEADER_HEIGHT = 88
const MIN_HEIGHT = 260
const scroller$ = ref<HTMLDivElement>()
const containerBottomStyle = ref({
	bottom: "unset",
	height: largeScreen.value ? `calc(100%-${HEADER_HEIGHT})` : `${MIN_HEIGHT}px`,
})
const { y } = useScroll(scroller$)

const { height: windowHeight } = useWindowSize()

const fullScreen = ref(false)

// This value is used to change the ratio of the scroll
// If the user scrolls 100px, the list will scroll 185px
const SCROLL_RATIO = 1.85

watch(
	[y, windowHeight, largeScreen],
	([y, windowHeight]) => {
		if (largeScreen.value) {
			containerBottomStyle.value = { bottom: "unset", height: "100%" }
		} else {
			const maxHeight = windowHeight - HEADER_HEIGHT
			const minHeight = windowHeight - HEADER_HEIGHT - MIN_HEIGHT

			const height = Math.min(windowHeight - minHeight + y * SCROLL_RATIO, maxHeight)
			fullScreen.value = height === maxHeight

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

function scrollToTop() {
	if (!scroller$.value) return
	scroller$.value.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth",
	})
}
</script>

<template>
	<div
		:style="containerBottomStyle"
		class="flex flex-row xl:flex-col gap-x-6 max-xl:justify-center"
	>
		<ul
			ref="scroller$"
			class="scroll-space p-6 h-full grid grid-cols-2 md:grid-cols-3 overflow-auto items-stretch xl:grid-cols-1 gap-6 xl:snap-y xl:snap-mandatory scroll-py-6 w-screen xl:w-96 bg-white"
			v-if="cryptoLocations.length > 0"
		>
			<li
				class="list-item-wrap xl:snap-start xl:flex-1 max-xl:w-sm"
				v-for="location in cryptoLocations"
				:key="location.id"
			>
				<LocationCard class="h-full" :location="location" />
			</li>
		</ul>

		<div v-else class="grid place-content-center p-6 w-screen xl:w-96 bg-white items-center gap-6">
			<CactusIcon class="text-space w-20 justify-self-center" />
			<p class="text-space text-center text-base xl:text-xl">Oops, no businesses around here</p>
		</div>

		<Button
			bgColor="white"
			class="self-end mb-5 shadow"
			size="md"
			@click="appStore.showLocationsList()"
		>
			<template #icon>
				<component
					:is="locationListVisible ? ChevronLeftIcon : ListIcon"
					class="text-space w-4.5"
					:class="{
						'h-4.5': locationListVisible,
						'h-4': !locationListVisible,
					}"
				/>
			</template>

			<template #text v-if="!smallScreen">
				{{ locationListVisible ? "Hide list" : "Show list" }}
			</template>
		</Button>

		<transition
			enter-active-class="duration-300 ease-out"
			enter-from-class="opacity-0 translate-y-12"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-12"
		>
			<Button
				v-if="notXlScreen && fullScreen"
				bg-color="ocean"
				class="absolute bottom-5 shadow z-20"
				@click="scrollToTop()"
			>
				<template #text>Back to the Map </template>
			</Button>
		</transition>
	</div>
</template>
