<script setup lang="ts">
import { defineAsyncComponent } from "vue"

const props = defineProps<{
	iconIndex: string
}>()

const AsyncIconComp = defineAsyncComponent(
	() => import(`@/components/icons/${props.iconIndex.toLowerCase()}.vue`)
)

const iconsWithRoundedBorder = ["icon-eth", "icon-xrp", "icon-xlm"]
const showBorder = iconsWithRoundedBorder.includes(props.iconIndex)
</script>

<template>
	<AsyncIconComp :class="{ 'border rounded-full border-[#3B4B68]/10': showBorder }" />
</template>
