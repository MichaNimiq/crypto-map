<script setup lang="ts">
import HeaderBar from "@/components/HeaderBar.vue"
import TheMap from "@/components/TheMap.vue"
import TheList from "@/components/TheList.vue"
import ModalFilter from "@/components/ModalFilter.vue"
</script>

<template>
	<div class="flex flex-col w-screen h-full overflow-hidden">
		<HeaderBar />

		<div class="flex flex-col h-[calc(100%-72px)] xl:flex-row-reverse relative">
			<TheMap />
			<TheList />
		</div>
		<ModalFilter />
	</div>
</template>
