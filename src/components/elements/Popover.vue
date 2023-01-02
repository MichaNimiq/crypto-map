<script setup lang="ts">
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"

import { Tooltip } from "@nimiq/vue3-components";
import { useSlots } from "vue";

defineProps({
	ctaHref: {
		type: String,
		default: undefined,
	},
	container: {
		type: HTMLElement,
		default: undefined,
	},

	// FIXME: A workaround to place the tooltip in the header differently than in the list
	customTop: {
		type: Boolean,
		default: undefined,
	},
})

const slots = useSlots()
const hasSlot = (name: "title" | "description" | "bottom" | "cta") => {
	return !!slots[name]
}
</script>

<template>
	<Tooltip :container="container"
		class="relative [&>.tooltip-box]:absolute [&>.tooltip-box]:w-screen [&>.tooltip-box]:max-w-xs z-20">
		<template #trigger>
			<slot name="trigger" />
		</template>

		<div class="w-scren sm:px-0 overflow-hidden absolute top-8" :class="{ 'left-2': !customTop }">
			<svg v-if="customTop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10"
				class="text-space relative w-max h-3 left-2">
				<path fill="currentColor"
					d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z" />
			</svg>
			<div class="shadow ring-1 ring-space/30 children:px-4 py-3 bg-gradient-space rounded-sm space-y-2">
				<h3 class="text-white font-bold text-lg" v-if="hasSlot('title')">
					<slot name="title" />
				</h3>

				<p class="text-white/60 text-sm" v-if="hasSlot('description')">
					<slot name="description" />
				</p>
				<a class="text-sky font-bold text-sm group flex items-center gap-x-1.5 w-max" v-if="hasSlot('cta') && ctaHref"
					:href="ctaHref" target="_blank">
					<slot name="cta" />
					<ArrowLinkIcon class="w-2.5 h-2.5 group-hover:left-0.5 group-hover:-top-0.5 transition-all duration-300" />
				</a>
				<slot name="bottom" v-if="hasSlot('bottom')" />
			</div>
		</div>
	</Tooltip>
</template>
