<template>
	<Combobox v-model="selected" v-slot="{ open }" as="div">
		<label v-if="label || hasSlot('label')" :for="randomId" class="text-space/40 capitalize">
			<slot name="label">
				{{ label }}
			</slot>
		</label>
		<div class="relative z-20">
			<div
				class="h-10 relative w-full cursor-default overflow-hidden text-left ring-[1.5px]"
				:class="{
					'ring-space/[0.15]': !open,
					'ring-ocean/30': open,
					'rounded-full': roundedFull,
					'rounded-4': !roundedFull,
				}"
			>
				<ComboboxInput
					class="w-full border-none pt-[8.5px] pb-[4.5px] pl-4 pr-[3.25rem] text-lg leading-5 placeholder:text-space/60 focus:ring-0 outline-none"
					:class="{ 'text-space': !open, 'text-ocean': open }"
					autocomplete="off"
					placeholder="Search crypto map"
					:displayValue="(match) => (match as QueryMatch).city"
					@change="query = $event.target.value"
					:id="randomId"
				/>
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-4">
					<component :is="inputRightIcon" class="w-5 h-6 text-space/40" />
				</ComboboxButton>
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
						v-if="filteredMatches.length === 0 && query !== ''"
						class="relative cursor-default select-none py-2 px-4"
						:class="{
							'text-space/80': bgCombobox === 'white',
							'text-white/80': bgCombobox === 'space',
						}"
					>
						Nothing found.
					</div>

					<ComboboxOption
						v-for="match in filteredMatches"
						as="template"
						:key="match.id"
						:value="match"
						v-slot="{ selected, active }"
					>
						<li
							class="relative select-none py-1.5 flex items-center transition-colors cursor-pointer"
							:class="{
								'hover:bg-space/[0.06] ': bgCombobox === 'white',
								'hover:bg-space/60 ': bgCombobox === 'space',
								'px-6 gap-x-6': size === 'md',
								'px-3 gap-x-2': size === 'sm',
							}"
						>
							<div
								class="rounded-full w-8 h-8 grid place-content-center"
								:class="{
									'bg-space/10': bgCombobox === 'white' && size === 'md',
									'bg-white/10': bgCombobox === 'space' && size === 'md',
								}"
							>
								<component
									:is="match.icon"
									class="w-full h-full"
									:class="{
										'text-space': bgCombobox === 'white',
										'text-white': bgCombobox === 'space',
									}"
								/>
							</div>
							<span
								class="block truncate font-bold"
								:class="{
									'text-space': bgCombobox === 'white',
									'text-white': bgCombobox === 'space',
								}"
							>
								{{ match.city }}
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
import { ref, computed, useSlots } from "vue"
import SearchIcon from "@/components/icons/icon-search.vue"
import CarsAndBikesIcon from "@/components/icons/categories/cars-&-bikes.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"

import {
	Combobox,
	ComboboxInput,
	ComboboxButton,
	ComboboxOptions,
	ComboboxOption,
	TransitionRoot,
} from "@headlessui/vue"

type QueryMatch = {
	id: number
	city: string
	icon: typeof CarsAndBikesIcon
}

defineProps({
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
})

const randomId = Math.random().toString(36).substring(7)

const inputRightIcon = computed(() => (query.value !== "" ? CrossIcon : SearchIcon))

const possibleMatches = [
	{ id: 1, city: "Berlin", icon: CarsAndBikesIcon },
	{ id: 2, city: "Stockholm", icon: CarsAndBikesIcon },
	{ id: 3, city: "Barcelona", icon: CarsAndBikesIcon },
	{ id: 4, city: "Oslo", icon: CarsAndBikesIcon },
	{ id: 5, city: "Paris", icon: CarsAndBikesIcon },
	{ id: 6, city: "Rome", icon: CarsAndBikesIcon },
	{ id: 7, city: "Brussels", icon: CarsAndBikesIcon },
	{ id: 8, city: "Amsterdam", icon: CarsAndBikesIcon },
	{ id: 9, city: "Athens", icon: CarsAndBikesIcon },
	{ id: 10, city: "Lisbon", icon: CarsAndBikesIcon },
] as QueryMatch[]

let selected = ref("")
let query = ref("")

let filteredMatches = computed(() =>
	query.value === ""
		? possibleMatches
		: possibleMatches.filter((m) =>
				m.city
					.toLowerCase()
					.replace(/\s+/g, "")
					.includes(query.value.toLowerCase().replace(/\s+/g, ""))
		  )
)

const slots = useSlots()
function hasSlot(slotName: "label") {
	return slots[slotName] !== undefined
}
</script>
