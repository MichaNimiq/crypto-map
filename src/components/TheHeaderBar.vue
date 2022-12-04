<script setup lang="ts">
import LearnMorePopover from "@/components/elements/LearnMorePopover.vue"
import SearchBox from "@/components/elements/SearchBox.vue"
import FilterModal from "@/components/elements/FilterModal.vue"
import { useApp } from "@/stores/app"
import { useAutocomplete } from "@/composables/useAutocomplete"

const appStore = useApp()

const { autocomplete, suggestions, status } = useAutocomplete()
</script>

<template>
	<header class="w-full py-6 pr-6 pl-4 shadow-header flex items-center gap-x-2 z-10">
		<LearnMorePopover />
		<SearchBox :autocomplete="autocomplete" :suggestions="suggestions" :status="status" class="flex-1" rounded-full
			combobox-options-classes="w-[calc(100vw)] mt-12 left-[-51px] max-h-[220px] rounded-t-0" size="sm"
			@selected="appStore.goToPlaceId($event?.place_id)" />
		<FilterModal />
	</header>
</template>
