<script setup lang="ts">
import { defineAsyncComponent } from "vue"

const props = defineProps({
	category: {
		type: String,
		required: true,
	},
})

const icon = {
	cars_bikes: defineAsyncComponent(() => import("@/components/icons/categories/cars_bikes.vue")),
	cash: defineAsyncComponent(() => import("@/components/icons/categories/cash.vue")),
	computer_electronics: defineAsyncComponent(() => import("@/components/icons/categories/computer_electronics.vue")),
	entertainment: defineAsyncComponent(() => import("@/components/icons/categories/entertainment.vue")),
	food_drinks: defineAsyncComponent(() => import("@/components/icons/categories/food_drinks.vue")),
	health_beauty: defineAsyncComponent(() => import("@/components/icons/categories/health_beauty.vue")),
	hotel_lodging: defineAsyncComponent(() => import("@/components/icons/categories/hotel_lodging.vue")),
	leisure_activities: defineAsyncComponent(() => import("@/components/icons/categories/leisure_activities.vue")),
	miscellaneous: defineAsyncComponent(() => import("@/components/icons/categories/miscellaneous.vue")),
	restaurant_bar: defineAsyncComponent(() => import("@/components/icons/categories/restaurant_bar.vue")),
	shop: defineAsyncComponent(() => import("@/components/icons/categories/shop.vue")),
	sports_fitness: defineAsyncComponent(() => import("@/components/icons/categories/sports_fitness.vue")),
}[props.category]
</script>

<template>
	<component :is="icon" />
</template>
