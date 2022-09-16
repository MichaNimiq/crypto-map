<script setup lang="ts">
import debug from "@/debug"
import { watch, ref, onMounted } from "vue"
import ListItem from "@/components/elements/ListItem.vue"
import { storeToRefs } from "pinia"
import { useApp } from "@/stores/app"
import { useApi } from "@/stores/api"

const theList = ref<HTMLDivElement | null>(null)
const theListHandle = ref<HTMLDivElement | null>(null)
const scrollWrap = ref<HTMLDivElement | null>(null)
let theMap: HTMLDivElement | null = null

let dragMobileHandle = ref(false)

const appStore = useApp()
const { locationListVisible } = storeToRefs(appStore)

const apiStore = useApi()
const { locations } = storeToRefs(apiStore)

watch(locationListVisible, () => {
	resizing()
})

onMounted(() => {
	window.addEventListener("resize", () => {
		resizing()
	})

	window.addEventListener("dragover", (e: Event) => {
		touchMove(e.clientY)
	})

	window.addEventListener("touchmove", (e: Event) => {
		const touchChanged = e.changedTouches[0]
		touchMove(touchChanged.clientY)
	})

	theListHandle.value?.addEventListener("dragstart", () => {
		dragMobileHandle.value = true
	})

	theListHandle.value?.addEventListener("touchstart", () => {
		dragMobileHandle.value = true
	})

	theListHandle.value?.addEventListener("dragend", (e) => {
		touchEnd()
	})

	theListHandle.value?.addEventListener("touchend", (e) => {
		touchEnd()
	})

	if (window.innerWidth <= 768) {
		locationListVisible.value = false
	}

	resizing()
})

function touchEnd() {
	dragMobileHandle.value = false
	theList.value?.removeAttribute("style")
	resizing()
}

function touchMove(offsetY: number = 0) {
	if (dragMobileHandle.value) {
		const calculatedHeight = window.innerHeight - offsetY - 30
		theList.value.style.transition = "none"
		theList.value.style.minHeight = `${window.innerHeight - offsetY - 30}px`
		theList.value.style.height = `${window.innerHeight - offsetY - 30}px`
		if (calculatedHeight / window.innerHeight > 0.3) {
			locationListVisible.value = true
		} else {
			locationListVisible.value = false
		}
	}
}

function resizing() {
	if (!theList.value) return false

	if (window.innerWidth <= 768) {
		theList.value.removeAttribute("style")
	}

	// TODO This code is a little bit confusing, but it works.
	const listLeft = window.innerWidth >= 1360

	// if (!locationListVisible.value) {
	// 	// TODO use useBreakpoints
	// 	if (window.innerWidth > 768) {
	// 		const listWidthHeight = listLeft ? theList.value?.clientWidth : theList.value?.clientHeight
	// 		console.log(
	// 			"resizing",
	// 			theList.value?.clientWidth,
	// 			theList.value.style.marginLeft,
	// 			`-${listWidthHeight}px`
	// 		)
	// 		theList.value.style.marginLeft = listLeft ? `-${listWidthHeight}px` : "0px"
	// 		theList.value.style.marginBottom = listLeft ? "0px" : `-${listWidthHeight}px`
	// 	}
	// } else {
	// 	theList.value.removeAttribute("style")
	// }
}
</script>

<template>
	<!-- <div
		class="transition-all bg-white"
		:class="{
			'w-auto opacity-100 visible': locationListVisible,
			'w-0 opacity-0 invisible': !locationListVisible,
		}"
	>
		<ul class="h-full scroll-space flex flex-col overflow-auto">
			<li class="list-item-wrap" v-for="location in locations" :key="location.id">
				<ListItem
					v-if="location.pickups?.length > 0 || location.shippings?.length > 0"
					:itemData="location"
				/>
			</li>
		</ul>
	</div> -->
	<div
		ref="theList"
		id="the-list"
		:class="{
			visible: locationListVisible,
			'mb-[-300px] xl:mb-0 xl:ml-[-346px]': !locationListVisible,
		}"
	>
		<div class="mobile-handle" ref="theListHandle" draggable="true">
			<div class="bar"></div>
		</div>
		<div
			class="xl:h-full scroll-space overflow-x-auto xl:overflow-y-auto xl:overflow-x-hidden"
			ref="scrollWrap"
		>
			<ul class="list-wrap xl:w-[340px]">
				<li class="list-item-wrap" v-for="item in locations" :key="item.id">
					<ListItem v-if="item.pickups.length > 0 || item.shippings.length > 0" :itemData="item" />
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";

#the-list {
	background-color: var(--color-white);
	transition-property: height, min-height, margin-bottom, margin-left, box-shadow;
	transition-duration: $transition, $transition, $transition, $transition;
	transition-timing-function: ease, ease, ease, ease;
	// margin-top: calc(100vh - 88px - $paddingContent * 3);
	min-height: 30px;
	height: 30px;
	overflow: hidden;
	padding-top: 30px;

	&.visible {
		box-shadow: $shadowObject;

		min-height: 60%;
		height: 60%;

		@include media("small") {
			height: unset;
			min-height: unset;
		}
	}

	@include media("small") {
		height: unset;
		min-height: unset;
		padding-top: $paddingSmall;

		&[data-results="0"] {
			display: unset;
		}
	}

	@include media("big") {
		transition: margin-left $transition ease;
	}

	.mobile-handle {
		background-color: var(--color-white);
		height: 30px;
		width: 100%;
		position: absolute;
		top: 0;
		z-index: 1;
		cursor: grab;

		@include media("small") {
			display: none;
		}

		.bar {
			display: block;
			height: 4px;
			width: 80px;
			border-radius: 2px;
			position: absolute;
			top: $paddingSmall;
			left: 50%;
			transform: translateX(-50%);
			background-color: var(--color-blue-dark-30);
		}
	}

	.scroll-wrap {
		overflow: auto;
		height: 100%;
	}

	.list-wrap {
		display: flex;
		// flex-direction: column;
		gap: var(--padding-ui);
		padding: $paddingHuge $paddingMed $paddingHuge $paddingMed;

		@include media("small") {
			flex-direction: row;
			padding: $paddingMed;
		}

		@include media("big") {
			flex-direction: column;
			padding: $paddingContent;
		}
	}
}

.list-item-wrap {
	display: flex;
	justify-content: center;

	@include media("small") {
		justify-content: unset;
	}

	@include media("big") {
		justify-content: center;
	}
}
</style>
