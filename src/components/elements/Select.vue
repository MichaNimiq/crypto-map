<template>
	<Listbox v-model="selectedOptions" multiple @update:model-value="optionsUpdated">
		<div class="relative">
			<ListboxButton
				class="relative w-full ring-1 ring-space/[0.15] cursor-pointer rounded-4 bg-white py-2 pl-3 pr-10 text-left outline-none"
			>
				<span class="block truncate text-space">
					<slot name="placeholder">Select an option</slot>
				</span>
				<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<ArrowSelectIcon class="h-5 w-5 text-space/80" aria-hidden="true" />
				</span>
			</ListboxButton>

			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute -top-px -left-px w-[calc(100%+2px)] overflow-auto rounded-4 bg-white py-1 text-base ring-1 ring-space ring-opacity-5 focus:outline-none sm:text-sm scroll-grey z-40 bg-radial-space pb-4 max-h-60 shadow-select space-y-1"
				>
					<ListboxOption
						v-slot="{ active, selected }"
						v-for="option in options"
						:key="option.id"
						:value="option"
						as="template"
					>
						<li
							class="relative select-none py-2 pl-3 pr-2 text-white flex gap-x-2 items-center cursor-pointer transition-colors"
							:class="{ 'bg-white/10': active }"
						>
							<slot name="option" v-bind="option" />
							<div
								class="w-5 h-5 rounded-full ml-auto"
								:class="{
									'bg-white': selected,
									'border border-white/10': !selected,
								}"
							>
								<CheckIcon v-if="selected" class="w-6 h-6 -top-0.5 -left-0.5 text-space" />
							</div>
						</li>
					</ListboxOption>
					<div class="text-sm text-white/60 px-4 mt-2.5">
						<slot name="after-options" />
					</div>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
	<ul class="mt-2 flex flex-wrap gap-2">
		<li
			v-for="option in selectedOptions"
			class="w-max bg-space/[0.07] rounded-4 px-2 pt-1.5 pb-1 text-sm text-space flex gap-x-2.5 items-center"
		>
			<span>
				<slot name="selected-option" v-bind="option" />
			</span>
			<CloseIcon @click="removeSelectedOption(option)" class="text-space w-2 h-2 cursor-pointer" />
		</li>
	</ul>
</template>

<script setup lang="ts">
import CheckIcon from "@/components/icons/icon-check.vue"
import ArrowSelectIcon from "@/components/icons/icon-arrow-select.vue"
import CloseIcon from "@/components/icons/icon-close.vue"
import { ref } from "vue"

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"

export type SelectOption<T> = {
	id: string
	data: T
}

defineProps({
	options: {
		type: Array as () => SelectOption<any>[],
		default: () => [],
	},
})

const emit = defineEmits(["selected-update"])

const selectedOptions = ref<SelectOption<any>[]>([])

function removeSelectedOption(option: SelectOption<any>) {
	selectedOptions.value = selectedOptions.value.filter((o) => o.id !== option.id)
}

function optionsUpdated() {
	emit("selected-update", selectedOptions.value)
}
</script>
