<script setup lang="ts">
import FlagIcon from "@/components/icons/icon-flag.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import GoogleIcon from "@/components/icons/icon-google-g.vue"
import StarIcon from "@/components/icons/icon-star.vue"


import { useApi, type BaseEstablishment, type Establishment } from "@/stores/api"
import { RouterLink } from "vue-router"
import { computed, onMounted, ref } from "vue"

const card$ = ref<(BaseEstablishment | Establishment) & { $el: HTMLElement } | null>(null)

const props = defineProps<{
	establishment: Establishment | BaseEstablishment
}>()

const hasAllInfo = computed(() => props.establishment.hasAllInfo)

const { getEstablishmentByUuid, setEstablishment } = useApi()

// make an observer
const observer = new IntersectionObserver((entries) => {
	entries.forEach(async (entry) => {
		if (entry.isIntersecting && !hasAllInfo.value) {
			const establishment = await getEstablishmentByUuid(props.establishment.uuid)
			setEstablishment(establishment)
		}
	})
})

onMounted(() => {
	if (!card$.value) return
	observer.observe(card$.value.$el)
})

</script>

<template>
	<template v-if="hasAllInfo">
		<RouterLink :to="`/establishment/${establishment.uuid}`" class="children:px-6" ref="card$">

			<img :src="establishment.photoUrl" :alt="`Image of ${establishment.name}`"
				class="h-36 object-cover w-full !px-1.5 rounded-sm" loading="lazy" />

			<h2 class="mt-5 text-space text-lg font-bold flex-1">{{ establishment.name }}</h2>

			<p class="mt-2 flex items-center text-sm">
				<span class="text-space/60 capitalize">{{ establishment.gmapsType }}</span>
				<template v-if="establishment.rating">
					<StarIcon class="ml-2 text-gold" style="width: 13px; height: 13px" />
					<span class="ml-1 font-bold">{{ establishment.rating }}</span>
				</template>
			</p>

			<p class="text-space/60 text-sm">
				{{ establishment.address }}
			</p>

			<ul class="flex gap-x-1 mt-4 pb-6">
				<li v-for="({ symbol }) in establishment.currencies" :key="symbol" class="w-6 h-6 rounded-full">
					<CryptoIcon :crypto="symbol.toLowerCase()" />
				</li>
			</ul>
		</RouterLink>

		<hr class="bg-space/20 h-0.5" />

		<div class="px-6 flex gap-x-2 mt-4 flex-1 items-end">
			<a :href="establishment.gmapsUrl" target="_blank"
				class="z-1 flex-1 bg-ocean hover:bg-ocean/80 focus-visible:bg-ocean/80 transition-colors shadow rounded-full py-[7.5px] h-max">
				<GoogleIcon class="text-white mx-auto" />
			</a>

			<RouterLink :to="`/establishment/${establishment.uuid}/report`"
				class="z-1 bg-cherry hover:bg-cherry/80 focus-visible:bg-cherry/80 transition-colors shadow rounded-full text-center w-[35px] py-[7.5px] h-max">
				<FlagIcon class="text-white mx-auto" />
			</RouterLink>
		</div>
	</template>
	<template v-else>
		<RouterLink :to="`/establishment/${establishment.uuid}`" class="children:px-6" ref="card$">
			<div class="h-36 w-[calc(100%-12px)] rounded-sm bg-space/[0.06] animate-pulse !mx-1.5" />

			<h2 class="mt-5 text-space text-lg font-bold flex-1">{{ establishment.name }}</h2>

			<div class="h-5 flex gap-x-2 mt-2">
				<div class="w-20 bg-space/[0.06] animate-pulse rounded-sm"></div>
				<div class="w-8 bg-space/[0.06] animate-pulse rounded-sm"></div>
			</div>

			<div class="h-5 flex gap-x-2 mt-1">
				<div class="w-10 bg-space/[0.06] animate-pulse rounded-sm"></div>
				<div class="w-6 bg-space/[0.06] animate-pulse rounded-sm"></div>
				<div class="w-12 bg-space/[0.06] animate-pulse rounded-sm"></div>
				<div class="w-20 bg-space/[0.06] animate-pulse rounded-sm"></div>
			</div>

			<div class="flex gap-x-1 mt-4 pb-6">
				<div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
				<div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
				<div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
				<div class="w-6 h-6 rounded-full bg-space/[0.06] animate-pulse"></div>
			</div>
		</RouterLink>

		<hr class="bg-space/20 h-0.5" />

		<div class="px-6 flex gap-x-2 mt-4 flex-1 items-end">
			<div class="flex-1 h-[35px] rounded-full bg-space/[0.06] animate-pulse"></div>
			<div class="w-[35px] h-[35px] rounded-full bg-space/[0.06] animate-pulse"></div>
		</div>
	</template>

</template>
