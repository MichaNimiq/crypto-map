<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue"

import type { CryptoLocation } from "@/stores/api"
import { useApp } from "@/stores/app"
import { storeToRefs } from "pinia"
import { RouterLink } from "vue-router"

defineProps<{
	location: CryptoLocation
}>()

const appStore = useApp()
const { selectedLocation } = storeToRefs(appStore) // TODO Add styles for the selected location
</script>

<template>
	<div
		class="shadow-location-card border pt-1.5 pb-6 rounded-8 lg:w-[311px]"
		style="
			border-image-source: linear-gradient(
				180deg,
				rgba(59, 75, 104, 0.01) 0%,
				rgba(59, 75, 104, 0) 100%
			);
		"
	>
		<RouterLink :to="`/location/${location.id}`" class="contents children:px-6">
			<img
				:src="location.photoUrl"
				:alt="`Image of ${location.name}`"
				class="h-36 object-cover w-full !px-1.5 rounded-4"
				loading="lazy"
			/>

			<h2 class="mt-5 text-space text-lg font-bold flex-1">{{ location.name }}</h2>

			<p class="mt-2 flex items-center text-sm">
				<span class="text-space/60">{{ location.type }}</span>
				<template v-if="location.rating">
					<IconSvg
						iconIndex="icon-rating-star"
						class="ml-2 text-gold"
						style="width: 13px; height: 13px"
					/>
					<span class="ml-1 font-bold">{{ location.rating }}</span>
				</template>
			</p>

			<p class="text-space/60 text-sm">
				{{ location.address }}
			</p>

			<ul class="flex gap-x-1 mt-4 pb-6">
				<li v-for="{ short } in location.currencies" :key="short" class="w-6 h-6 rounded-full">
					<IconSvg :iconIndex="`icon-${short.toLowerCase()}`" />
				</li>
			</ul>
		</RouterLink>

		<hr class="bg-space/20 h-0.5" />

		<div class="px-6 flex gap-x-2 mt-4">
			<a
				:href="location.gmapsUrl"
				target="_blank"
				class="z-1 flex-1 bg-ocean hover:bg-ocean/80 focus-visible:bg-ocean/80 transition-colors shadow rounded-full py-[7.5px]"
			>
				<IconSvg :iconIndex="`icon-google-g`" class="text-white mx-auto" />
			</a>

			<RouterLink
				:to="`/location/${location.id}/report`"
				class="z-1 bg-tomato hover:bg-tomato/80 focus-visible:bg-tomato/80 transition-colors shadow rounded-full text-center w-[35px] grid place-items-center"
			>
				<IconSvg :iconIndex="`icon-flag`" class="text-white" />
			</RouterLink>
		</div>
	</div>

	<!-- <div class="item-image">
		</div>
		<div class="item-content">
			<div class="item-label">
				<div class="item-label-text">{{ location.name }}</div>
				<div v-if="!!location.gmapsUrl" class="item-label-link">
					<a
						:href="location.gmapsUrl"
						:title="`${$t('labels.visit')} ${location.name} ${$t('labels.on-google-maps')}`"
						target="_blank"
					>
						<IconSvg :iconIndex="`icon-google-g`" class="google-g" />
					</a>
				</div>
			</div>
			<div v-if="location.type" class="item-types">
				<div class="types-wrap">
					<span>
						{{ location.type }}
					</span>
				</div>
				<div v-if="location.rating" class="rating">
					<IconSvg iconIndex="icon-rating-star" class="star" />
					<span class="rating-number">{{ location.rating }}</span>
				</div>
			</div>
			<div class="item-addresses">
				<div id="`pickup-${item.id}`">
					<div v-if="location.address" class="item-address">
						{{ location.address }}
						<div v-if="location.rating > 0" class="rating">
							<IconSvg iconIndex="icon-rating-star" class="star" />
							<span class="rating-number">{{ location.rating }}</span>
						</div>
					</div>
				</div>
				<div class="item-currencies">
					<div v-for="(_, shortName) in location.currencies" :key="shortName" class="item-currency">
						<IconSvg v-if="shortName" :iconIndex="`icon-${shortName.toLowerCase()}`" />
					</div>
				</div>
			</div>
		</div> -->
</template>
