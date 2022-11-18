<script setup lang="ts">
import StarIcon from "@/components/icons/icon-star.vue"
import GoogleIcon from "@/components/icons/icon-google-g.vue"
import FlagIcon from "@/components/icons/icon-flag.vue"


import type { Establishment } from "@/stores/api"
import { useApp } from "@/stores/app"
import { storeToRefs } from "pinia"
import { RouterLink } from "vue-router"

defineProps<{
	establishment: Establishment
}>()

const appStore = useApp()
const { selectedEstablishmentId } = storeToRefs(appStore) // TODO Add styles for the selected establishment
</script>

<template>
	<RouterLink :to="`/establishment/${establishment.gmapsPlaceId}`" class="children:px-6">
		<img
			:src="establishment.photoUrl"
			:alt="`Image of ${establishment.name}`"
			class="h-36 object-cover w-full !px-1.5 rounded-4"
			loading="lazy"
		/>

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
			<li v-for="{ symbol } in establishment.currencies" :key="symbol" class="w-6 h-6 rounded-full">
				<CryptoIcon :crypto="symbol" />
			</li>
		</ul>
	</RouterLink>

	<hr class="bg-space/20 h-0.5" />

	<div class="px-6 flex gap-x-2 mt-4 flex-1 items-end">
		<a
			:href="establishment.gmapsUrl"
			target="_blank"
			class="z-1 flex-1 bg-ocean hover:bg-ocean/80 focus-visible:bg-ocean/80 transition-colors shadow rounded-full py-[7.5px] h-max"
		>
			<GoogleIcon class="text-white mx-auto" />
		</a>

		<RouterLink
			:to="`/establishment/${establishment.id}/report`"
			class="z-1 bg-tomato hover:bg-tomato/80 focus-visible:bg-tomato/80 transition-colors shadow rounded-full text-center w-[35px] py-[7.5px] h-max"
		>
			<FlagIcon class="text-white mx-auto" />
		</RouterLink>
	</div>
</template>
