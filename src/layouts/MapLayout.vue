<script setup lang="ts">
import TheHeaderBar from "@/components/TheHeaderBar.vue"
import TheMap from "@/components/TheMap.vue"
import TheList from "@/components/TheList.vue"
</script>

<template>
	<div class="flex flex-col w-screen h-full overflow-hidden">
		<TheHeaderBar />

		<div class="flex h-[calc(100%-72px)] xl:flex-row-reverse relative">
			<TheMap />
			<TheList class="absolute" />
		</div>
	</div>
</template>
