<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import CategoryIcon from "@/components/elements/CategoryIcon.vue"
import CryptoIcon from "@/components/elements/CryptoIcon.vue"
import Select from "@/components/elements/Select.vue"
import CrossIcon from "@/components/icons/icon-cross.vue"
import FilterIcon from "@/components/icons/icon-filter.vue"
import { useBreakpoints } from "@/composables/useBreakpoints"
import { useApi } from "@/stores/api"
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const isOpen = ref(false)

const { smallScreen } = useBreakpoints()

const apiStore = useApi()
const { currenciesOptions, categoriesOptions, selectedCategories, selectedCurrencies } =
	storeToRefs(apiStore)

const nFilters = computed(() => {
	return selectedCategories.value.length + selectedCurrencies.value.length
})

function closeModal() {
	isOpen.value = false
}
function openModal() {
	isOpen.value = true
}
</script>

<template>
	<Button @click="openModal" bgColor="grey" size="md">
		<template #icon>
			<FilterIcon class="text-space w-4.5 h-4.5" />
		</template>
		<template #text v-if="!smallScreen"> {{ $t('Filters') }} </template>
		<template #badge v-if="nFilters > 0"> {{ nFilters }} </template>
	</Button>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-20">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
				leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-space/60" />
			</TransitionChild>

			<div class="fixed bottom-0 inset-x-0 md:inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95">
						<DialogPanel
							class="relative w-full md:max-w-lg transform rounded-t-8 md:rounded-lg bg-white py-8 px-10 text-left align-middle shadow-lg transition-all">
							<CrossIcon @click="closeModal" class="absolute top-6.5 right-6.5 text-space/40 w-4 h-6 cursor-pointer" />

							<DialogTitle as="h2" class="text-2xl font-bold text-space text-center">
								{{ $t('Filters') }}
							</DialogTitle>
							<hr class="w-full bg-space/10 h-px my-8" />

							<Select placeholder="Select cryptocurrencies" :options="currenciesOptions" v-model="selectedCurrencies">
								<template #label>
									<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
										{{ $t('Cryptocurrencies') }}
									</h3>
								</template>
								<template #option="{ id, label }">
									<div class="flex items-center gap-x-2">
										<CryptoIcon class="w-6 h-6" :crypto="id as string" />
										<span><b>{{ id }}</b>, {{ $t(label) }}</span>
									</div>
								</template>
								<template #after-options> More cryptocurrencies supported in the future </template>
								<template #selected-option="{ label }"> {{ label }} </template>
							</Select>
							<hr class="w-full bg-space/10 h-px my-8" />
							<Select :options="categoriesOptions.map(({ id, label }) => ({ id, label: $t(label) }))"
								v-model="selectedCategories" placeholder="Select category">
								<template #label>
									<h3 class="uppercase text-sm text-space/40 tracking-wider font-semibold mb-8">
										{{ $t('Categories') }}
									</h3>
								</template>
								<template #option="{ id, label }">
									<CategoryIcon class="w-6 h-6" :category="id as string" />
									{{ label }}
								</template>
								<template #selected-option="{ label }">
									{{ $t(label) }}
								</template>
							</Select>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
