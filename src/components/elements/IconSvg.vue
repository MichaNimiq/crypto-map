<script setup lang="ts">
import { defineAsyncComponent } from "vue"

const props = defineProps<{
	iconIndex: string
}>()

const AsyncIconComp = defineAsyncComponent(
	() => import(`@/components/icons/${props.iconIndex.toLowerCase()}.vue`)
)
</script>

<template>
	<AsyncIconComp />
</template>
