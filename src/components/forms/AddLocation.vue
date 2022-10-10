<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"
import { useCaptcha } from "@/composables/useCaptcha"
import { useApi } from "@/stores/api"
import { storeToRefs } from "pinia"
import { ref } from "vue"
import SearchBox from "../elements/SearchBox.vue"
import Select from "../elements/Select.vue"

const apiStore = useApi()
const { cryptoCurrencies } = storeToRefs(apiStore)

const selectedCurrencies = ref([])

const { captchaOk } = useCaptcha()
function onSubmit() {
	console.log("submit")
	console.log(captchaOk())
}
</script>

<template>
	<main
		class="flex flex-col h-full justify-center md:text-center md:max-w-sm lg:max-w-3xl mx-auto min-h-screen"
	>
		<h1 class="font-bold text-4xl lg:text-5xl text-space">Add a place to the Crypto Map</h1>
		<p class="text-space/60 font-semibold mt-6 lg:mt-8">
			You can add any place that has a Google Business Profile.
		</p>
		<a
			class="text-sky font-bold text-sm group flex justify-center items-center gap-x-1.5 mt-4"
			href="https://nimiq.com"
			target="_blank"
		>
			Create Google Business profile
			<ArrowLinkIcon
				class="w-2.5 h-2.5 group-hover:left-0.5 group-hover:-top-0.5 transition-all duration-300"
			/>
		</a>

		<form class="mt-14 lg:mt-16 text-left" @submit.prevent="onSubmit">
			<SearchBox
				label="Find place"	
				combobox-options-classes="w-[calc(100%+16px)] -left-2"
				bg-combobox="space"
				input-id="search-input"
				size="sm"
			/>

			<Select
				class="mt-6"
				label="Select cryptocurrency"	
				input-id="cryptocurrency-input"
				:options="cryptoCurrencies"
				@selected-update="selectedCurrencies = $event"
				placeholder="Select cryptocurrency"
			>
				<template #option="{ id, name }">
					<CryptoIcon class="w-6 h-6" :crypto="id" />
					<span>
						<span class="font-bold">{{ id }}</span>
						{{ name }}
					</span>
				</template>
				<template #after-options> More cryptocurrencies supported in the future </template>
				<template #selected-option="{ name }">{{ name }} </template>
			</Select>

			<!-- TODO add color -->
			<Button bgColor="ocean" type="submit" class="mx-auto mt-10">
				<template #text>Submit Place</template>
			</Button>
		</form>
	</main>
</template>
