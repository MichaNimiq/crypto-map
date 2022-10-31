<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import LocationCard from "@/components/elements/LocationCard.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import CactusIcon from "@/components/icons/icon-cactus.vue"
import ListIcon from "@/components/icons/icon-list.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { storeToRefs } from "pinia"
import { ref, watch } from "vue"

const { smallScreen, xlScreen } = useBreakpoints()

const scroller$ = ref<HTMLDivElement>()

const fullScreen = ref(false)

const appStore = useApp()
const { locationListVisible, selectedLocationId } = storeToRefs(appStore)

const apiStore = useApi()
const { cryptoLocations } = storeToRefs(apiStore)

watch(selectedLocationId, (placeId) => {
	if (!placeId) return
	const i = cryptoLocations.value.map((l) => l.placeId).indexOf(placeId)
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
		class="xl:flex xl:gap-x-6 absolute max-xl:transition-all xl:transition-transform-width max-h-main bottom-0"
		:class="{
			'xl:-translate-x-96': !locationListVisible,
			'max-xl:bottom-0': locationListVisible && cryptoLocations.length === 0,
		}"
	>
		<ul
			ref="scroller$"
			class="w-screen xl:w-96 p-6 columns-2xs gap-x-6 space-y-6 snap-y snap-mandatory scroll-py-6 bg-white shadow overflow-y-auto h-auto min-h-main scroll-space z-2"
			v-if="cryptoLocations.length > 0"
		>
			<li
				class="list-item-wrap xl:snap-start shadow-lg border pt-1.5 pb-6 rounded-8 flex flex-col break-inside-avoid-column"
				v-for="location in cryptoLocations"
				:key="location.id"
				style="
					border-image-source: linear-gradient(
						180deg,
						rgba(59, 75, 104, 0.01) 0%,
						rgba(59, 75, 104, 0) 100%
					);
				"
			>
				<LocationCard :location="location" />
			</li>
		</ul>

		<div
			v-else
			class="grid place-content-center p-6 w-screen xl:w-96 bg-white items-center gap-6 max-xl:py-20 shadow xl:h-main"
		>
			<CactusIcon class="text-space w-20 justify-self-center" />
			<p class="text-space text-center text-base xl:text-xl">Oops, no businesses around here</p>
		</div>

		<transition
			enter-active-class="duration-200 ease-out"
			enter-from-class="opacity-0 translate-y-12"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="duration-100 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-12"
		>
			<div v-if="xlScreen || !locationListVisible" class="self-end">
				<Button
					bgColor="white"
					class="max-xl:fixed bottom-0 mb-5 max-xl:left-5 shadow z-1"
					size="md"
					@click="appStore.toggleLocationList()"
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
			</div>
		</transition>

		<transition
			enter-active-class="duration-200 ease-out"
			enter-from-class="opacity-0 translate-y-12"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="duration-100 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 translate-y-12"
		>
			<div
				v-if="!xlScreen && locationListVisible"
				class="w-full flex justify-center max-xl:fixed bottom-5 z-10"
			>
				<Button bg-color="ocean" class="shadow" @click="appStore.hideLocationsList()">
					<template #text>Back to the Map</template>
				</Button>
			</div>
		</transition>
	</div>
</template>
