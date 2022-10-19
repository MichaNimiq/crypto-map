<template>
	<Button @click="openModal" bgColor="grey">
		<template #icon>
			<FilterIcon class="text-space w-6 h-6" />
		</template>
		<template #text v-if="!smallScreen"> Filters </template>
	</Button>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-20">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-space/60" />
			</TransitionChild>

			<div class="fixed bottom-0 inset-x-0 md:inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="relative w-full md:max-w-lg transform rounded-t-8 md:rounded-8 bg-white py-8 px-10 text-left align-middle shadow-lg transition-all"
						>
							<CrossIcon
								@click="closeModal"
								class="absolute top-6.5 right-6.5 text-space/40 w-4 h-6 cursor-pointer"
							/>

							<DialogTitle as="h2" class="text-2xl font-bold text-space text-center">
								Filters
							</DialogTitle>
							<hr class="w-[calc(100%+5rem)] bg-space/10 h-px my-8 -left-10" />

							<Select
								placeholder="Select cryptocurrencies"
								:options="cryptoCurrencies"
								@selected-update="selectedFilters.cryptoCurrencies = $event"
							>
								<template #label>
									<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
										Cryptocurrencies
									</h3>
								</template>
								<template #option="{ id, name }">
									<CryptoIcon class="w-6 h-6" :crypto="id" />
									<span>
										<span class="font-bold">{{ id }}</span
										>, {{ name }}
									</span>
								</template>
								<template #after-options> More cryptocurrencies supported in the future </template>
								<template #selected-option="{ id, name }"> Icon -> {{ id }}: {{ name }} </template>
							</Select>
							<hr class="w-[calc(100%+5rem)] bg-space/10 h-px my-8 -left-10" />
							<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
								Type of location
							</h3>
							<Select
								placeholder="Select category"
								:options="categories"
								@update:selected-updated="selectedFilters.categories = $event"
							>
								<template #label>
									<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
										Category
									</h3>
								</template>
								<template #option="{ id, name }">
									<!-- <component :is="id" /> -->
									<span>{{ name }}</span>
								</template>
								<template #selected-option="{ name }">
									{{ name }}
								</template>
							</Select>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import Select from "@/components/elements/Select.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"
import FilterIcon from "@/components/icons/icon-filter.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { storeToRefs } from "pinia"
import { ref } from "vue"

const isOpen = ref(false)

const { smallScreen } = useBreakpoints()

const apiStore = useApi()
const { cryptoCurrencies, categories, selectedFilters } = storeToRefs(apiStore)

function closeModal() {
	isOpen.value = false
}
function openModal() {
	isOpen.value = true
}
</script>
