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
							<CloseIcon
								@click="closeModal"
								class="absolute top-6.5 right-6.5 text-space/40 w-4.5 h-4.5 cursor-pointer"
							/>

							<DialogTitle as="h2" class="text-2xl font-bold text-space text-center">
								Filters
							</DialogTitle>
							<hr class="w-[calc(100%+5rem)] bg-space/10 h-px my-8 -left-10" />
							<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
								Cryptocurrencies
							</h3>
							<Select
								:options="cryptoCurrenciesOptions"
								@selected-update="selectedFilters.cryptoCurrencies = $event"
							>
								<template #placeholder>Select cryptocurrency</template>
								<template #option="{ data }">
									<CryptoIcon class="w-6 h-6" :crypto="data.short" />
									<span>
										<span class="font-bold">{{ data.short }}</span
										>, {{ data.name }}
									</span>
								</template>
								<template #after-options> More cryptocurrencies supported in the future </template>
								<template #selected-option="{ data }">{{ data.name }}</template>
							</Select>
							<hr class="w-[calc(100%+5rem)] bg-space/10 h-px my-8 -left-10" />
							<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
								Type of location
							</h3>
							<Select
								:options="categoriesOptions"
								@update:selected-updated="selectedFilters.categories = $event"
							>
								<template #placeholder>Select category</template>
								<template #option="{ data }">
									<!-- <component :is="data.icon" /> -->
									<span>{{ data }}</span>
								</template>
								<template #selected-option="{ data }">{{ data }}</template>
							</Select>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from "vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import Button from "@/components/elements/Button.vue"
import Select, { type SelectOption } from "@/components/elements/Select.vue"
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"
import CloseIcon from "@/components/icons/icon-close.vue"
import FilterIcon from "@/components/icons/icon-filter.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import type { CryptoInformation } from "@/stores/api"
import { useApp } from "@/stores/app"
import { storeToRefs } from "pinia"

const isOpen = ref(false)

const { smallScreen } = useBreakpoints()

const appStore = useApp()
const { availableFilters, selectedFilters } = storeToRefs(appStore)

function closeModal() {
	isOpen.value = false
}
function openModal() {
	isOpen.value = true
}

const cryptoCurrenciesOptions: SelectOption<CryptoInformation>[] =
	availableFilters.value.cryptoCurrencies.map(({ short, name }) => ({
		id: short,
		data: { name, short },
	}))

const categoriesOptions: SelectOption<string>[] = availableFilters.value.categories.map(
	(category, index) => ({
		id: String(index),
		data: category,
	})
)
</script>
