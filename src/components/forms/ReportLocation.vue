<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import Select, { type SelectOption } from "@/components/elements/Select.vue"
import TextAreaInput from "@/components/elements/TextAreaInput.vue"
import { useCaptcha } from "@/composables/useCaptcha"
import { mapApi, useApi } from "@/stores/api"
import { computed } from "@vue/reactivity"
import { storeToRefs } from "pinia"
import { onMounted, onUnmounted, ref } from "vue"
import { useRoute } from "vue-router"

const apiStore = useApi()
const { categoriesIssue } = storeToRefs(apiStore)

const selectedIssue = ref<SelectOption>()
const issueDescription = ref<string>("")

const { getToken, loadRecaptcha, removeRecaptcha } = useCaptcha()

const route = useRoute()

onMounted(() => {
	loadRecaptcha()
})

onUnmounted(() => {
	removeRecaptcha()
})

const disabled = computed(() => {
	return !selectedIssue.value || !issueDescription.value || sending.value
})

const sending = ref(false)
const errorMsg = ref("")

onMounted(async () => {
	console.log("mounted", categoriesIssue.value.length)
	if (categoriesIssue.value.length === 0) {
		await apiStore.setIssueCategories()
	}
})

async function onSubmit() {
	if (disabled.value || !selectedIssue.value) return

	errorMsg.value = ""
	sending.value = true

	const token = await getToken()
	const res = await mapApi
		.postLocationIssue({
			locationIssueBody: {
				token,
				issue_category_id: selectedIssue.value?.id as string,
				google_place_id: route.params.place_id as string,
				description: issueDescription.value,
			},
		})
		.catch((err) => {
			errorMsg.value = "Unable to report the issue. Please try again later."
		})
	sending.value = false
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
				:options="categoriesIssue"
				v-model:selected-single="selectedIssue"
				:multiple="false"
				placeholder="Select issue"
				replace-placeholder
			/>

			<TextAreaInput
				placeholder="Write your problem here"
				class="mt-6"
				label="Describe the issue"
				v-model="issueDescription"
			/>

			<Button
				bgColor="ocean"
				type="submit"
				class="mx-auto mt-10"
				:loading="sending"
				size="lg"
				:disabled="disabled"
			>
				<template #text>Report Place</template>
			</Button>

			<p class="text-tomato text-sm mt-2 absolute">
				{{ errorMsg }}
			</p>
		</form>
	</main>
</template>
