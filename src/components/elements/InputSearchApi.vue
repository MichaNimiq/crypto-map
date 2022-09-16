<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue"
import { useApi } from "@/stores/api";
import { ref } from "vue"

// TODO
// don't use the coords for the text search and filter for everything

const autocompleteElement = ref(null)

let typingTimeout: number | undefined = undefined

const currentValue = ""

// TODO Use composable
function onInput(event: Event) {
	if (!autocompleteElement.value) return false

	const inputElement = autocompleteElement.value as HTMLInputElement

	// workaround as the event would also fire when we input things
	// and then remove the focus from it (triggering the change event)
	// so for not calling unnecessary API calls, checking if the value
	// really changed on the change event
	if (event.type == "change") {
		const elementChanged = event.target as HTMLInputElement

		if (elementChanged.value == inputElement.value) return false
	}

	clearTimeout(typingTimeout)

	const { search } = useApi()

	typingTimeout = setTimeout(() => {
		// TODO Use v-model with the input and search with that term!
		search()
	}, 400)
}
</script>

<template>
	<div class="input-wrap">
		<div class="input-icon-wrap">
			<input
				type="text"
				class="search search-places"
				ref="autocompleteElement"
				:placeholder="$t('placeholders.search-places')"
				@change="onInput"
				@input="onInput"
				v-model="currentValue"
			/>
			<IconSvg iconIndex="icon-search" class="magnifier" />
		</div>
	</div>
</template>