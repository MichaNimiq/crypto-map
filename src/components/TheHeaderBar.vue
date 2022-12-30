<script setup lang="ts">
import TheLearnMorePopover from "@/components/elements/TheLearnMorePopover.vue"
import SearchBox from "@/components/elements/SearchBox.vue"
import FilterModal from "@/components/elements/FilterModal.vue"
import { useGoogle } from "@/stores/google"
import { useAutocomplete } from "@/composables/useAutocomplete"
import { type Suggestion, SuggestionType } from "@/composables/useAutocomplete"
import { storeToRefs } from "pinia"
import { useApp } from "@/stores/app"
import { useApi } from "@/stores/api"

const googleStore = useGoogle()

const apiStore = useApi()
const { selectedCategories, selectedCurrencies } = storeToRefs(apiStore)

const appStore = useApp()

const { autocomplete, suggestions, status } = useAutocomplete({ searchFor: [SuggestionType.GOOGLE_REGIONS, SuggestionType.API] })

function onSelect(suggestion?: Suggestion) {
	if (!suggestion) return

	if (suggestion.type === SuggestionType.GOOGLE_REGIONS) {
		googleStore.goToPlaceId(suggestion.id)
		return
	} else if (suggestion.type === SuggestionType.API) {
		switch (suggestion.apiSuggestion) {
			case 'category':
				selectedCategories.value = [suggestion.id]
				break
			case 'currency':
				selectedCurrencies.value = [suggestion.id]
				break
			case 'establishment':
				appStore.goToEstablishment(suggestion.id)
				break
		}
	}
}
</script>

<template>
	<header class="w-full py-6 pr-6 pl-4 shadow-header flex items-center gap-x-2 z-10">
		<TheLearnMorePopover />
		<SearchBox :autocomplete="autocomplete" :suggestions="suggestions" :status="status" class="flex-1" rounded-full
			combobox-options-classes="w-[calc(100vw)] mt-12 left-[-51px] max-h-[220px] rounded-t-0" size="sm"
			@selected="onSelect" />
		<FilterModal />
	</header>
</template>
