<script setup lang="ts">
import TheHeaderBar from "@/components/TheHeaderBar.vue"
import TheMap from "@/components/TheMap.vue"
import TheList from "@/components/TheList.vue"
import { useApp } from "@/stores/app"
import { storeToRefs } from "pinia"

const appStore = useApp()
const { locationListVisible } = storeToRefs(appStore)
</script>

<template>
	<div class="flex flex-col w-screen overflow-hidden min-h-screen">
		<TheHeaderBar />

		<div class="flex h-[calc(100vh-80px)] relative">
			<TheMap class="relative w-screen" />
			<TheList
				class="absolute transition-transform-width"
				:class="{
					'xl:-translate-x-96': !locationListVisible,
					'max-xl:-translate-y-96': locationListVisible,
				}"
			/>
		</div>
	</div>
</template>
