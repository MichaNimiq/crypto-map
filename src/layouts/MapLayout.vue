<script setup lang="ts">
import TheHeaderBar from "@/components/TheHeaderBar.vue"
import TheMap from "@/components/TheMap.vue"
import TheList from "@/components/TheList.vue"
</script>

<template>
	<div class="flex flex-col w-screen overflow-hidden min-h-screen">
		<TheHeaderBar />

		<div class="flex h-[calc(100vh-88px)] xl:flex-row-reverse relative">
			<TheMap />
			<TheList class="absolute" />
		</div>
	</div>
</template>
