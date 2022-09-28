<template>
	<Combobox v-model="selected" v-slot="{ open }">
		<div class="relative h-full z-20">
			<div
				class="h-10 relative w-full cursor-default overflow-hidden rounded-full text-left ring-[1.5px]"
				:class="{ 'ring-space/[0.15]': !open, 'ring-ocean/30': open }"
			>
				<ComboboxInput
					class="w-full border-none pt-[8.5px] pb-[4.5px] pl-4 pr-[3.25rem] text-lg leading-5 placeholder:text-space/60 focus:ring-0 outline-none"
					:class="{ 'text-space': !open, 'text-ocean': open }"
					autocomplete="off"
					placeholder="Search crypto map"
					:displayValue="(match) => (match as QueryMatch).city"
					@change="query = $event.target.value"
				/>
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-4">
					<SearchIcon
						class="w-5 h-6"
						:class="{ 'text-space/40': !open, 'text-ocean/30': open }"
					></SearchIcon>
				</ComboboxButton>
			</div>
			<TransitionRoot
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				@after-leave="query = ''"
			>
				<ComboboxOptions
					class="absolute mt-6 max-h-48 -left-16 scroll-space overflow-auto rounded-b-4 bg-white text-base focus:outline-none shadow-lg w-screen"
				>
					<div
						v-if="filteredMatches.length === 0 && query !== ''"
						class="relative cursor-default select-none py-2 px-4 text-gray-700"
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
							class="relative select-none py-1.5 px-6 flex gap-x-6 items-center hover:bg-space/[0.06] transition-colors cursor-pointer"
						>
							<div class="rounded-full w-8 h-8 grid place-content-center bg-space/10">
								<component :is="match.icon" class="w-full h-full text-space" />
							</div>
							<span class="block truncate font-bold text-space">
								{{ match.city }}
							</span>
							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3"
								:class="{ 'text-white': active, 'text-teal-600': !active }"
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
import { ref, computed } from "vue"
import SearchIcon from "@/components/icons/icon-search.vue"
import CarsAndBikesIcon from "@/components/icons/categories/cars-&-bikes.vue"

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
</script>
