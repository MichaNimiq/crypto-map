<script setup lang="ts">
import LearnMorePopover from "@/components/elements/LearnMorePopover.vue"
import SearchBox from "@/components/elements/SearchBox.vue"
import FilterModal from "@/components/elements/FilterModal.vue"
</script>

<template>
	<header class="w-full py-6 pr-6 pl-4 shadow-header flex items-center gap-x-2 z-10">
		<LearnMorePopover />
		<SearchBox
			class="flex-1"
			rounded-full
			combobox-options-classes="w-screen mt-12 -left-16 max-h-[220px] rounded-t-0"
			size="md"
		/>
		<FilterModal />
	</header>
</template>
