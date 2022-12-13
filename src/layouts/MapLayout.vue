<script setup lang="ts">
import TheHeaderBar from "@/components/TheHeaderBar.vue"
import TheList from "@/components/TheList.vue"
import TheMap from "@/components/TheMap.vue"
</script>

<template>
	<div class="flex flex-col w-screen fixed h-full">
		<TheHeaderBar />

		<div class="flex h-full relative">
			<TheMap class="relative w-screen" />
			<TheList />
		</div>
	</div>
</template>