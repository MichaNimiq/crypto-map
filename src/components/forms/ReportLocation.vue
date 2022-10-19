<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import Select, { type SelectOption } from "@/components/elements/Select.vue"
import TextAreaInput from "@/components/elements/TextAreaInput.vue"
import { useCaptcha } from "@/composables/useCaptcha"
import { useApi } from "@/stores/api"
import { computed } from "@vue/reactivity"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const apiStore = useApi()
const { cryptoCurrencies, issueCategories } = storeToRefs(apiStore)

const userInput = {
	issueDescription: ref(""),
	selectedCurrencies: ref<SelectOption[]>([]),
	selectedIssue: ref<SelectOption>(),
}

const showCurrencies = computed(
	() =>
		userInput.selectedIssue.value &&
		["missing-currency", "missing-not-accepted"].includes(userInput.selectedIssue.value.id)
)

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
		<h1 class="font-bold text-4xl lg:text-5xl text-space">Report an issue with a place</h1>

		<form class="mt-14 lg:mt-16 text-left" @submit.prevent="onSubmit">
			<Select
				label="Select issue"
				:options="issueCategories"
				:multiple="false"
				placeholder="Select issue"
				@selected-update="userInput.selectedIssue = $event"
			/>

			<Select
				v-if="showCurrencies"
				class="mt-6"
				label="Select currency"
				:options="cryptoCurrencies"
				@selected-update="userInput.selectedCurrencies = $event"
				placeholder="Select cryptocurrency"
			>
				<template #option="{ id, name }">
					<CryptoIcon class="w-6 h-6" :crypto="id" />
					<span>
						<span class="font-bold">{{ id }}</span>
						{{ name }}
					</span>
				</template>
				<template #selected-option="{ name }">
					{{ name }}
				</template>
			</Select>

			<TextAreaInput
				placeholder="Write your problem here"
				class="mt-6"
				label="Describe the issue"
				v-model="userInput.issueDescription"
			/>

			<!-- TODO add color -->
			<Button bgColor="ocean" type="submit" class="mx-auto mt-10">
				<template #text>Report Place</template>
			</Button>
		</form>
	</main>
</template>
