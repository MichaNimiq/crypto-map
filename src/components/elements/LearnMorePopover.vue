<script setup lang="ts">
import NimIcon from "@/components/icons/cryptos/icon-nim.vue"
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue"
</script>

<template>
	<Popover class="relative mr-1">
		<PopoverButton
			class="focus-visible:ring-1 outline-none focus-visible:ring-space/10 rounded-4 grid place-content-center"
		>
			<NimIcon class="w-6" />
		</PopoverButton>

		<transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0"
		>
			<PopoverPanel class="absolute -left-1.5 z-10 mt-1 w-screen sm:px-0 max-w-xs">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 28 10"
					class="text-space ml-3 h-8 w-full"
				>
					<path
						fill="currentColor"
						d="M12.63 1.83 8.27 8.25A4 4 0 0 1 4.97 10h17.8a4 4 0 0 1-3.3-1.75L15.1 1.83a1.5 1.5 0 0 0-2.48 0z"
					/>
				</svg>
				<div
					class="overflow-hidden shadow ring-1 ring-black px-4 py-3 ring-opacity-5 bg-radial-space rounded-4 space-y-2"
				>
					<h3 class="text-white font-bold text-lg">Crypto Map</h3>
					<p class="text-white/60 text-sm">
						This app is brought to you by Nimiq, only places that are verified by Google are
						accepted for this map.
					</p>
					<a
						class="text-sky font-bold text-sm group flex items-center gap-x-1.5 w-max"
						href="https://nimiq.com"
						target="_blank"
					>
						Go to Nimiq
						<ArrowLinkIcon
							class="w-2.5 h-2.5 group-hover:left-0.5 group-hover:-top-0.5 transition-all duration-300"
						/>
					</a>
					<img
						class="mt-4 ml-auto opacity-40"
						alt="Nimiq logo"
						src="@/assets/nimiq-horizontal-logo.svg"
					/>
				</div>
			</PopoverPanel>
		</transition>
	</Popover>
</template>
