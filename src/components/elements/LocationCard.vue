<script setup lang="ts">
import StarIcon from "@/components/icons/icon-star.vue"
import GoogleIcon from "@/components/icons/icon-google-g.vue"
import FlagIcon from "@/components/icons/icon-flag.vue"

import CryptoIcon from "@/components/elements/CryptoIcon.vue"

import type { CryptoLocation } from "@/stores/api"
import { useApp } from "@/stores/app"
import { storeToRefs } from "pinia"
import { RouterLink } from "vue-router"

defineProps<{
	location: CryptoLocation
}>()

const appStore = useApp()
const { selectedLocationId } = storeToRefs(appStore) // TODO Add styles for the selected location
</script>

<template>
	<RouterLink :to="`/location/${location.id}`" class="children:px-6">
		<img
			:src="location.photoUrl"
			:alt="`Image of ${location.name}`"
			class="h-36 object-cover w-full !px-1.5 rounded-4"
			loading="lazy"
		/>

		<h2 class="mt-5 text-space text-lg font-bold flex-1">{{ location.name }}</h2>

		<p class="mt-2 flex items-center text-sm">
			<span class="text-space/60 capitalize">{{ location.type }}</span>
			<template v-if="location.rating">
				<StarIcon class="ml-2 text-gold" style="width: 13px; height: 13px" />
				<span class="ml-1 font-bold">{{ location.rating }}</span>
			</template>
		</p>

		<p class="text-space/60 text-sm">
			{{ location.address }}
		</p>

		<ul class="flex gap-x-1 mt-4 pb-6">
			<li v-for="{ id } in location.currencies" :key="id" class="w-6 h-6 rounded-full">
				<CryptoIcon :crypto="id" />
			</li>
		</ul>
	</RouterLink>

	<hr class="bg-space/20 h-0.5" />

	<div class="px-6 flex gap-x-2 mt-4 flex-1 items-end">
		<a
			:href="location.gmapsUrl"
			target="_blank"
			class="z-1 flex-1 bg-ocean hover:bg-ocean/80 focus-visible:bg-ocean/80 transition-colors shadow rounded-full py-[7.5px] h-max"
		>
			<GoogleIcon class="text-white mx-auto" />
		</a>

		<RouterLink
			:to="`/location/${location.id}/report`"
			class="z-1 bg-tomato hover:bg-tomato/80 focus-visible:bg-tomato/80 transition-colors shadow rounded-full text-center w-[35px] py-[7.5px] h-max"
		>
			<FlagIcon class="text-white mx-auto" />
		</RouterLink>
	</div>
</template>
