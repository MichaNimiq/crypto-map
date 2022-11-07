<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import ArrowLinkIcon from "@/components/icons/icon-arrow-link.vue"
import { useCaptcha } from "@/composables/useCaptcha"
import { useApi, mapApi } from "@/stores/api"
import { storeToRefs } from "pinia"
import { onMounted, onUnmounted, ref, computed } from "vue"
import SearchBox from "../elements/SearchBox.vue"
import Select from "../elements/Select.vue"

const apiStore = useApi()
const { cryptoCurrencies } = storeToRefs(apiStore)

const selectedCurrencies = ref<typeof cryptoCurrencies.value>([])
const selectedPlace = ref<google.maps.places.AutocompletePrediction>()

const { getToken, loadRecaptcha, removeRecaptcha } = useCaptcha()

onMounted(() => {
	loadRecaptcha()
})

onUnmounted(() => {
	removeRecaptcha()
})

const sending = ref(false)
const disabled = computed(
	() => selectedCurrencies.value.length === 0 || !selectedPlace.value || sending.value
)
const errorMsg = ref("")

async function onSubmit() {
	if (disabled.value) return

	errorMsg.value = ""
	sending.value = true

	const token = await getToken()
	const res = await mapApi
		.postCandidate({
			locationCandidateBody: {
				currencies: selectedCurrencies.value.map((c) => (c.id as string).toUpperCase()),
				token,
				google_place_id: selectedPlace.value?.place_id || "",
				name: selectedPlace.value?.description || "",
			},
		})
		.catch((err) => {
			errorMsg.value = "Unable to submit location. Please try again later."
		})
	sending.value = false

	console.log(res)
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
				combobox-options-classes="w-[calc(100%+4px)] -left-0.5 top-unset"
				bg-combobox="space"
				input-id="search-input"
				:types="['establishment']"
				@selected="selectedPlace = $event"
			/>

			<Select
				class="mt-6"
				label="Select cryptocurrency"
				input-id="cryptocurrency-input"
				:options="cryptoCurrencies"
				v-model="selectedCurrencies"
				placeholder="Select cryptocurrency"
			>
				<template #option="{ id, name }">
					<CryptoIcon class="w-6 h-6" :crypto="id as string" />
					<span>
						<span class="font-bold">{{ (id as string).toUpperCase() }}</span>
						{{ name }}
					</span>
				</template>
				<template #after-options> More cryptocurrencies supported in the future </template>
				<template #selected-option="{ name }">{{ name }} </template>
			</Select>

			<!-- TODO add color -->
			<Button
				bgColor="ocean"
				type="submit"
				class="mx-auto mt-10"
				size="lg"
				:loading="sending"
				:disabled="disabled"
			>
				<template #text>Submit Place</template>
			</Button>

			<p class="text-tomato text-sm mt-2 absolute">
				{{ errorMsg }}
			</p>
		</form>
	</main>
</template>
