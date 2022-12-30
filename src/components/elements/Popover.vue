<script setup lang="ts">
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue"
import { useSlots } from "vue";

defineProps({
	ctaHref: {
		type: String,
		default: undefined,
	},
})

const slots = useSlots()
const hasSlot = (name: "title" | "description" | "bottom" | "cta") => {
	return !!slots[name]
}
</script>

<template>
	<Popover class="relative mr-1 z-10" @click.stop="">
		<PopoverButton
			class="focus-visible:ring-1 outline-none focus-visible:ring-space/10 ring-offset-4 rounded-sm grid place-content-center">
			<slot name="trigger" />
		</PopoverButton>

		<transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
			<PopoverPanel class="absolute -left-1.5 z-10 mt-1.5 w-screen sm:px-0 max-w-xs">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 10" class="text-space relative w-max h-3 left-px">
					<path fill="currentColor"
						d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z" />
				</svg>
				<div class="overflow-hidden shadow ring-1 ring-space/30 px-4 py-3 bg-gradient-space rounded-sm space-y-2">
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
			</PopoverPanel>
		</transition>
	</Popover>
</template>
