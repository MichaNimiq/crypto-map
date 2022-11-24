<script setup lang="ts">
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import { useApi } from "@/stores/api"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import SearchBox from "../elements/SearchBox.vue"
import Select from "../elements/Select.vue"

const apiStore = useApi()
const { currenciesOptions } = storeToRefs(apiStore)

const selectedCurrencies = ref<string[]>([])
const selectedPlace = ref<google.maps.places.AutocompletePrediction>()

const disabled = computed(() => selectedCurrencies.value.length === 0 || !selectedPlace.value)

async function onSubmit(token: string) {
	return await apiStore.addCandidate({
		token,
		currencies: selectedCurrencies.value,
		gmaps_place_id: selectedPlace.value?.place_id || "",
		name: selectedPlace.value?.description || "",
	})
}
</script>

<template>
	<FormContainer :disabled="disabled" :on-submit="onSubmit">
		<template #title>Add a place to the Crypto Map</template>
		<template #description>You can add any place that has a Google Business Profile.</template>
		<template #link>
			<a href="https://www.google.com/business/" target="_blank"> Create Google Business profile </a>
		</template>
		<template #form>
			<SearchBox label="Find place" combobox-options-classes="w-[calc(100%+4px)] -left-0.5 top-unset"
				bg-combobox="space" input-id="search-input" :types="['establishment']" @selected="selectedPlace = $event" />

			<Select class="mt-6" label="Select cryptocurrency" input-id="cryptocurrency-input" :options="currenciesOptions"
				v-model="selectedCurrencies" placeholder="Select cryptocurrency">
				<template #option="{ id, label }">
					<CryptoIcon class="w-6 h-6" :crypto="id as string" />
					<span>
						<span class="font-bold">{{ (id as string).toUpperCase() }}</span>
						{{ label }}
					</span>
				</template>
				<template #after-options> More cryptocurrencies supported in the future </template>
				<template #selected-option="{ label }">{{ label }} </template>
			</Select>
		</template>
		<template #button-label>Submit Place</template>

		<!-- Success -->
		<template #success-title>Thank you for submitting a new place to the Crypto Map!</template>
		<template #success-description>This may take a few days to process. Keep an eye out for the new location in the
			Crypto
			map.</template>
		<template #success-button-label>Back to Crypto map</template>

		<!-- Error -->
		<template #error-title>Something went wrong.</template>
		<template #error-description>There has been a problem on our side.</template>
		<template #error-button-label>Try again</template>
	</FormContainer>
</template>
