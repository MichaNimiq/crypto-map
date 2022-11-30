<template>
	<Combobox v-model="selected" v-slot="{ open }" as="div" nullable @update:model-value="emit('selected', selected)">
		<ComboboxLabel v-if="hasLabel" class="text-space/40 capitalize">
			<slot name="label">
				{{ label }}
			</slot>
		</ComboboxLabel>
		<div class="relative z-20" :class="{ 'mt-1': hasLabel }">
			<div class="relative w-full cursor-default overflow-hidden text-left ring-[1.5px]" :class="{
				'ring-space/[0.15]': !open,
				'ring-ocean/30': open,
				'rounded-full': roundedFull,
				'rounded-sm': !roundedFull,
			}">
				<ComboboxInput class="w-full border-none placeholder:text-space/60 focus:ring-0 outline-none pr-[3.25rem] pl-4"
					:class="{
						'text-space': !open,
						'text-ocean': open,
						'text-sm py-[5px]': size === 'sm',
						'text-base py-2': size === 'md',
					}" autocomplete="off" :placeholder="$t('Search_Crypto_Map')"
					:displayValue="(region) => (region as google.maps.places.AutocompletePrediction)?.description"
					@change="query = $event.target.value" />

				<div class="absolute inset-y-0 right-0 flex items-center pr-4">
					<ComboboxButton v-if="!userCanCleanInput">
						<SearchIcon class="w-4 h-5 text-space/40" />
					</ComboboxButton>
					<button v-else>
						<CrossIcon class="w-4 h-5 text-space/40" @click="clearInput()" />
					</button>
				</div>
			</div>
			<TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0">
				<ComboboxOptions
					class="absolute w-full scroll-space overflow-auto rounded-sm text-base focus:outline-none shadow-lg top-0.5"
					:class="[
						comboboxOptionsClasses,
						{
							'bg-white': bgCombobox === 'white',
							'bg-space': bgCombobox === 'space',
						},
					]">
					<div class="relative cursor-default select-none py-2 px-4" :class="{
						'text-space/80': bgCombobox === 'white',
						'text-white/80': bgCombobox === 'space',
					}" v-if="status && [AutocompleteStatus.NO_RESULTS, AutocompleteStatus.LOADING].includes(status)">
						<span v-if="status === AutocompleteStatus.LOADING">
							{{ $t('Loading') }}
						</span>
						<span v-else-if="status === AutocompleteStatus.NO_RESULTS && query === ''">
							{{ $t('Start_Typing') }}
						</span>
						<span v-else-if="status === AutocompleteStatus.NO_RESULTS && query !== ''">
							{{ $t('Nothing_found') }}
						</span>
					</div>

					<ComboboxOption v-else v-for="(suggestion, i) in suggestions" as="template" :key="i" :value="suggestion"
						v-slot="{ selected, active }">
						<li class="relative select-none py-1.5 flex items-center transition-colors cursor-pointer" :class="{
							'hover:bg-space/[0.06]': bgCombobox === 'white',
							'hover:bg-space/60': bgCombobox === 'space',
							'bg-space/[0.06]': bgCombobox === 'white' && active,
							'bg-space/60': bgCombobox === 'space' && active,
							'px-6 gap-x-6': size === 'sm',
							'px-3 gap-x-2': size === 'md',
						}">
							<span class="block truncate" :class="{
								'text-space': bgCombobox === 'white',
								'text-white': bgCombobox === 'space',
							}" v-html="'description' in suggestion ? makeBold(suggestion.description, suggestion.matched_substrings) : suggestion.label">
							</span>
							<span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3" :class="{
								'text-white':
									(active && bgCombobox === 'white') || (!active && bgCombobox === 'space'),
								'text-space':
									(!active && bgCombobox === 'white') || (active && bgCombobox === 'space'),
							}">
							</span>
						</li>
					</ComboboxOption>
				</ComboboxOptions>
			</TransitionRoot>
		</div>
	</Combobox>
</template>

<script setup lang="ts">
import CrossIcon from "@/components/icons/icon-cross.vue"
import SearchIcon from "@/components/icons/icon-search.vue"
import { AutocompleteStatus, useApp } from "@/stores/app"
import { useApi } from "@/stores/api"
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxLabel,
	ComboboxOption,
	ComboboxOptions,
	TransitionRoot
} from "@headlessui/vue"
import { storeToRefs } from "pinia"
import { computed, ref, useSlots, watch } from "vue"

type Option = google.maps.places.AutocompletePrediction

const props = defineProps({
	roundedFull: {
		type: Boolean,
		default: false,
	},
	comboboxOptionsClasses: {
		type: String,
		default: "",
	},
	bgCombobox: {
		type: String as () => "space" | "white",
		default: "white",
	},
	size: {
		type: String as () => "sm" | "md",
		default: "md",
	},
	label: {
		type: String,
		default: "",
	},
	types: {
		type: Array as () => string[],
		default: undefined,
	},
})

const emit = defineEmits({
	selected: (value?: Option) => value,
})

const userCanCleanInput = computed(() => query.value !== "" && query.value !== undefined)

const selected = ref<Option>()
const query = ref<string>()

const appStore = useApp()
const { autocomplete } = appStore;
const { suggestions: suggestionsGoogle, autocompleteStatus: status } = storeToRefs(appStore)

const apiStore = useApi()
const { autocompleteApi } = apiStore;
const { suggestionsApi } = storeToRefs(apiStore);


watch(
	() => query.value,
	() => {
		if (query.value === "undefined")
			query.value = undefined
		if (!query.value) return

		autocompleteApi(query.value)
		autocomplete(query.value, props.types)
	}
)

const suggestions = ref<(Option | { label: string, onclick: () => void })[]>([])

watch(
	() => [suggestionsGoogle.value, suggestionsApi.value],
	() => {
		if (suggestionsGoogle.value && suggestionsApi.value) {
			suggestions.value = [...suggestionsApi.value, ...suggestionsGoogle.value]
		}
	}
)

const slots = useSlots()
const hasLabel = computed(() => props.label || hasSlot("label"))
function hasSlot(slotName: "label") {
	return slots[slotName] !== undefined
}

function makeBold(str: string, matches: Option["matched_substrings"]) {
	matches.forEach((match) => {
		const bolded = str.slice(match.offset, match.offset + match.length)
		str = str.replace(bolded, `<b>${bolded}</b>`)
	})
	return str
}

function clearInput() {
	selected.value = undefined
	query.value = undefined
}
</script>
