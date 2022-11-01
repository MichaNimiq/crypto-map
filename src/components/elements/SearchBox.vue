<template>
	<Combobox
		v-model="selected"
		v-slot="{ open }"
		as="div"
		nullable
		@update:model-value="emit('selected', selected)"
	>
		<label v-if="hasLabel" :for="randomId" class="text-space/40 capitalize">
			<slot name="label">
				{{ label }}
			</slot>
		</label>
		<div class="relative z-20" :class="{'mt-1': hasLabel}">
			<div
				class="relative w-full cursor-default overflow-hidden text-left ring-[1.5px]"
				:class="{
					'ring-space/[0.15]': !open,
					'ring-ocean/30': open,
					'rounded-full': roundedFull,
					'rounded-4': !roundedFull,
				}"
			>
				<ComboboxInput
					class="w-full border-none placeholder:text-space/60 focus:ring-0 outline-none pr-[3.25rem] pl-4"
					:class="{
						'text-space': !open,
						'text-ocean': open,
						'text-sm py-[5px]': size === 'sm',
						'text-base py-2': size === 'md',
					}"
					autocomplete="off"
					placeholder="Search crypto map"
					:displayValue="(region) => (region as Option)?.description "
					@change="query = $event.target.value"
					:id="randomId"
				/>

				<template class="absolute inset-y-0 right-0 flex items-center pr-4">
					<ComboboxButton v-if="!userCanCleanInput">
						<SearchIcon class="w-4 h-5 text-space/40" />
					</ComboboxButton>
					<button v-else>
						<CrossIcon class="w-4 h-5 text-space/40" @click="clearInput()" />
					</button>
				</template>
			</div>
			<TransitionRoot
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				@after-leave="query = ''"
			>
				<ComboboxOptions
					class="absolute w-full scroll-space overflow-auto rounded-4 text-base focus:outline-none shadow-lg top-0.5"
					:class="[
						comboboxOptionsClasses,
						{
							'bg-white': bgCombobox === 'white',
							'bg-space': bgCombobox === 'space',
						},
					]"
				>
					<div
						class="relative cursor-default select-none py-2 px-4"
						:class="{
							'text-space/80': bgCombobox === 'white',
							'text-white/80': bgCombobox === 'space',
						}"
						v-if="
							status && [AutocompleteStatus.NO_RESULTS, AutocompleteStatus.LOADING].includes(status)
						"
					>
						<span v-if="status === AutocompleteStatus.LOADING">Loading...</span>
						<span v-else-if="status === AutocompleteStatus.NO_RESULTS && query === ''">
							Start typing...
						</span>
						<span v-else-if="status === AutocompleteStatus.NO_RESULTS && query !== ''"
							>Nothing found.</span
						>
					</div>

					<ComboboxOption
						v-else
						v-for="suggestion in suggestions"
						as="template"
						:key="suggestion.place_id"
						:value="suggestion"
						v-slot="{ selected, active }"
					>
						<li
							class="relative select-none py-1.5 flex items-center transition-colors cursor-pointer"
							:class="{
								'hover:bg-space/[0.06]': bgCombobox === 'white',
								'hover:bg-space/60': bgCombobox === 'space',
								'bg-space/[0.06]': bgCombobox === 'white' && active,
								'bg-space/60': bgCombobox === 'space' && active,
								'px-6 gap-x-6': size === 'sm',
								'px-3 gap-x-2': size === 'md',
							}"
						>
							<!-- <div
								class="rounded-full w-8 h-8 grid place-content-center"
								:class="{
									'bg-space/10': bgCombobox === 'white' && size === 'md',
									'bg-white/10': bgCombobox === 'space' && size === 'md',
								}"
							>
								<CarsAndBikesIcon
									class="w-full h-full"
									:class="{
										'text-space': bgCombobox === 'white',
										'text-white': bgCombobox === 'space',
									}"
								/>
							</div> -->
							<span
								class="block truncate"
								:class="{
									'text-space': bgCombobox === 'white',
									'text-white': bgCombobox === 'space',
								}"
								v-html="makeBold(suggestion.description, suggestion.matched_substrings)"
							>
							</span>
							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3"
								:class="{
									'text-white':
										(active && bgCombobox === 'white') || (!active && bgCombobox === 'space'),
									'text-space':
										(!active && bgCombobox === 'white') || (active && bgCombobox === 'space'),
								}"
							>
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
import { AutocompleteStatus, useMap } from "@/stores/map"
import {
Combobox,
ComboboxButton,
ComboboxInput,
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
	selected: (value?: google.maps.places.AutocompletePrediction) => value,
})

const randomId = Math.random().toString(36).substring(7)

const userCanCleanInput = computed(() => query.value !== "")

let selected = ref<Option>()
let query = ref("")

const mapStore = useMap()
const { suggestions, autocompleteStatus: status } = storeToRefs(mapStore)

watch(
	() => query.value,
	() => mapStore.autocomplete(query.value, props.types)
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
	query.value = ""
}
</script>
