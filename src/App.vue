<template>
	<router-view v-slot="{ Component, route }">
		<transition :name="route.meta.transition">
			<component :is="Component" />
		</transition>
	</router-view>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"
</script>

<style scoped lang="scss">
.slide-left-leave-active,
.slide-left-enter-active {
	@apply transition-transform;
}

.slide-left-enter {
	transform: translate(100%, 0);
}

.slide-left-leave-to {
	transform: translate(-100%, 0);
}

.slide-right-leave-active,
.slide-right-enter-active {
	@apply transition-transform;
}

.slide-right-enter {
	transform: translate(-100%, 0);
}

.slide-right-leave-to {
	transform: translate(200%, 0);
}
</style>