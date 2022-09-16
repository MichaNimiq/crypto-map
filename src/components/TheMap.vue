<script setup lang="ts">
import { useRoute } from "vue-router"
import { defineAsyncComponent, onMounted, ref } from "vue"
import { useApp } from "@/stores/app"
import googleMapsHelperInstance from "@/google-maps-helper"
import Button from "@/components/elements/Button.vue"
import IconSvg from "@/components/elements/IconSvg.vue"
import { storeToRefs } from "pinia"
import ListIcon from "@/components/icons/icon-list.vue"
import ChevronLeftIcon from "@/components/icons/icon-arrow-small-left.vue"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

const route = useRoute()
const { greater } = useBreakpoints(breakpointsTailwind)
const isXlScreen = greater("xl")

const appStore = useApp()
const { locationListVisible } = storeToRefs(appStore)

const mapWrapper = ref<HTMLInputElement | null>(null)
const theMap = ref<HTMLInputElement | null>(null)

onMounted(() => {
	googleMapsHelperInstance.elementMapWrapper = mapWrapper.value
	googleMapsHelperInstance.elementMap = theMap.value

	if (typeof route.params.lat !== "undefined" && typeof route.params.lng !== "undefined")
		googleMapsHelperInstance.center = {
			lat: parseFloat(route.params.lat.toString()),
			lng: parseFloat(route.params.lng.toString()),
		}

	googleMapsHelperInstance.init()
})

function clickShowList() {
	console.log("clickShowList")

	if (window.innerWidth <= 768) {
		const elList = document.querySelector("#map-list-wrap")
		elList?.scrollTo({
			top: 350,
			behavior: "smooth",
		})
	}
}
</script>

<template>
	<!-- TODO Aria with the controls -->
	<main id="map-wrapper" class="w-full" ref="mapWrapper">
		<div id="the-map" ref="theMap"></div>
		<Button
			v-if="isXlScreen"
			class="absolute left-5 bottom-5 md:left-6 md:bottom-6"
			bgColor="white"
			@click="appStore.toggleLocationList()"
		>
			<template #icon>
				<component :is="locationListVisible ? ChevronLeftIcon : ListIcon" />
			</template>

			<template #text> {{ locationListVisible ? "Hide list" : "Show list" }} </template>
		</Button>

		<div class="absolute top-5 right-5 md:top-6 md:right-6 flex flex-col gap-y-4">
			<Button style="width: 34px; height: 34px" bgColor="white" size="sm" id="user-geolocation">
				<template #icon>
					<IconSvg iconIndex="icon-location" />
				</template>
			</Button>

			<div class="flex flex-col bg-white rounded-full">
				<Button
					style="width: 34px; height: 34px"
					class="rounded-b-0"
					bgColor="white"
					size="sm"
					id="zoom-in"
				>
					<template #icon>
						<IconSvg iconIndex="icon-plus" />
					</template>
				</Button>
				<hr class="bg-space/10 h-px self-stretch" />
				<Button
					style="width: 34px; height: 34px"
					class="rounded-t-0"
					bgColor="white"
					size="sm"
					id="zoom-out"
				>
					<template #icon>
						<IconSvg iconIndex="icon-minus" />
					</template>
				</Button>
			</div>
		</div>
	</main>
</template>

<!-- It is not scoped because we want to apply the popup styles for now -->
<!-- TODO Move popup styles somewhere else and change this to scoped css -->
<style lang="scss">
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";

#map-wrapper {
	position: relative;
	height: 100%;
	transition: flex-basis $transition ease;
	border-radius: 0px;

	@include media("small") {
		flex-grow: 1;
		flex-shrink: 0;
		height: unset;
		width: unset;
	}

	#the-map {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.pin {
		border: 1px solid;
		border-image-source: linear-gradient(
			180deg,
			rgba(59, 75, 104, 0.01) 0%,
			rgba(59, 75, 104, 0) 100%
		);
		box-shadow: var(--shadow-pin);
	}
}

.map-popup {
	background-color: var(--color-blue-dark-100);
	padding: $paddingSmall;
	border-radius: $borderRadiusBig;
	position: absolute;
	transform: translate(-50%, calc(-100% - 6px));
	top: 0;
	left: 0;
	cursor: pointer;
	color: var(--color-white);
	font-size: var(--font-size-pinTitle);
	font-weight: 700;
	font-family: $fontFamily;
	height: 40px;
	display: flex !important;
	align-items: center;
	border-radius: 20px;
	padding: 0 18px;
	box-shadow: $shadowObject;

	&:after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 100%);
		width: 0;
		height: 0;
		border-left: 11px solid transparent;
		border-right: 11px solid transparent;
		border-top: 16px solid var(--color-blue-dark-100);
	}

	&:hover,
	&.selected {
		background-color: var(--color-blue);
		z-index: 1;
		box-shadow: $shadowObjectHover;

		&:after {
			border-top: 16px solid var(--color-blue);
		}
	}
}
</style>
