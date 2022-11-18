<script setup lang="ts">
import Select, { type SelectOption } from "@/components/elements/Select.vue"
import TextAreaInput from "@/components/elements/TextAreaInput.vue"
import FormContainer from "@/components/forms/FormContainer.vue"
import { useApi } from "@/stores/api"
import { computed } from "@vue/reactivity"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

const apiStore = useApi()
const { categoriesIssue } = storeToRefs(apiStore)

const selectedIssue = ref<SelectOption>()
const issueDescription = ref<string>("")

const route = useRoute()

const disabled = computed(() => !selectedIssue.value || !issueDescription.value)

onMounted(async () => {
	await apiStore.fetchIssueCategories()
})

async function onSubmit(token: string) {
	if (!selectedIssue.value?.id || !route.params.id) return
	return await apiStore.reportEstablishment({
		token,
		issue_category_id: selectedIssue.value.id as number,
		establishment_id: Number(route.params.id),
		description: issueDescription.value,
	})
}
</script>

<template>
	<FormContainer :disabled="disabled" :on-submit="onSubmit">
		<template #title>Report an issue with a place</template>
		<template #form>
			<Select label="Select issue" :options="categoriesIssue" v-model:selected-single="selectedIssue" :multiple="false"
				placeholder="Select issue" replace-placeholder />

			<TextAreaInput placeholder="Write your problem here" class="mt-6" label="Describe the issue"
				v-model="issueDescription" />
		</template>
		<template #button-label>Report Place</template>

		<!-- Success -->
		<template #success-title>Thank you for reporting this issue</template>
		<template #success-description>This may take a few days to process. Keep an eye out for changes to the location in
			the
			Crypto map.</template>
		<template #success-button-label>Back to Crypto map</template>

		<!-- Error -->
		<template #error-title>Something went wrong.</template>
		<template #error-description>There has been a problem on our side.</template>
		<template #error-button-label>Try again</template>
	</FormContainer>
</template>
