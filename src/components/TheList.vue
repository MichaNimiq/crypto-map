<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import EstablishmentCard from "@/components/elements/EstablishmentCard.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import CactusIcon from "@/components/icons/icon-cactus.vue"
import ListIcon from "@/components/icons/icon-list.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { useApp } from "@/stores/app"
import { computed } from "@vue/reactivity"
import { storeToRefs } from "pinia"
import { ref, watch } from "vue"

const { smallScreen, xlScreen } = useBreakpoints()

const scroller$ = ref<HTMLDivElement>()

const appStore = useApp()
const { listIsShown, selectedEstablishmentId } = storeToRefs(appStore)

const apiStore = useApi()
const { establishmentsInView } = storeToRefs(apiStore)

const listIsEmpty = computed(() => establishmentsInView.value.size === 0)

watch(selectedEstablishmentId, (id) => {
	if (!id || !scroller$.value) return
	const item = scroller$.value.querySelector(`[data-establishment-id="${id}"]`)
	const index = item ? Array.from(scroller$.value.children).indexOf(item) : 0
	slideTo(index, listIsShown.value ? "smooth" : "auto")
})

function slideTo(index: number, behavior: "smooth" | "auto" = "smooth") {
	if (!scroller$.value) return
	if (!listIsShown) appStore.showList()
	listIsShown.value = true
	const li = scroller$.value.children[index] as HTMLLIElement
	li.scrollIntoView({ inline: "center", block: "center", behavior })
}
</script>

<template>
	<div
		class="xl:flex xl:gap-x-6 absolute max-xl:transition-all xl:transition-transform-width max-xl:bottom-0 overflow-auto scroll-space max-xl:bg-white max-xl:shadow max-xl:w-screen"
		:class="{
			'xl:-translate-x-96 max-xl:top-full': !listIsShown,
			'h-main': !listIsEmpty,
		}">
		<ul ref="scroller$"
			class="xl:w-96 p-6 columns-2xs gap-x-6 space-y-6 snap-y snap-mandatory scroll-py-6 bg-white xl:shadow overflow-y-auto scroll-space z-2 relative max-xl:pb-16 "
			v-if="!listIsEmpty">
			<li v-for="[_, establishment] in establishmentsInView" :key="establishment.id"
				class="list-item-wrap xl:snap-start shadow-lg border pt-1.5 pb-6 rounded-lg flex flex-col break-inside-avoid-column transition-[box-shadow]"
				:class="{ 'ring ring-ocean': establishment.id === selectedEstablishmentId }"
				:data-establishment-id="establishment.id">
				<EstablishmentCard :establishment="establishment" />
			</li>
		</ul>

		<div v-else
			class="grid place-content-center p-6 w-screen xl:w-96 bg-white items-center gap-6 max-xl:py-20 xl:shadow xl:h-main">
			<CactusIcon class="text-space w-20 justify-self-center" />
			<p class="text-space text-center text-base xl:text-xl">Oops, no businesses around here</p>
		</div>

		<transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 translate-y-12"
			enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-100 ease-in"
			leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-12">
			<div class="self-end" v-if="xlScreen || !listIsShown">
				<Button bgColor="white" class="max-xl:fixed bottom-0 mb-5 max-xl:left-5 shadow z-1" size="md"
					@click="appStore.toggleList()">
					<template #icon>
						<component :is="listIsShown ? ChevronLeftIcon : ListIcon" class="text-space w-4.5" :class="{
							'h-4.5': listIsShown,
							'h-4': !listIsShown,
						}" />
					</template>

					<template #text v-if="!smallScreen">
						{{ listIsShown ? "Hide list" : "Show list" }}
					</template>
				</Button>
			</div>
		</transition>

		<transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 translate-y-12"
			enter-to-class="opacity-100 translate-y-0" leave-active-class="duration-100 ease-in"
			leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-12">
			<div v-if="!xlScreen && listIsShown" class="w-full flex justify-center fixed bottom-5 z-10">
				<Button bg-color="ocean" class="shadow" @click="appStore.hideList">
					<template #text>Back to the Map</template>
				</Button>
			</div>
		</transition>
	</div>
</template>
