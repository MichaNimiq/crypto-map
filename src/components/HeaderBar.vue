<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue"
import InputSearchApi from "@/components/elements/InputSearchApi.vue"
import ButtonFilter from "@/components/elements/ButtonFilter.vue"
import ButtonResize from "@/components/elements/ButtonResize.vue"
import PopupInfo from "@/components/elements/PopupInfo.vue"
import { ref } from "vue"
import { onClickOutside } from "@vueuse/core"

let infoVisible = ref<boolean>(false)
const elInfoWindow = ref(null)

onClickOutside(elInfoWindow, () => {
	infoVisible.value = false
})
</script>

<template>
	<header>
		<button class="nimiq-icon">
			<IconSvg
				iconIndex="icon-nim"
				@click="
					() => {
						infoVisible = !infoVisible
					}
				"
			/>
		</button>
		<PopupInfo
			ref="elInfoWindow"
			:class="`${infoVisible ? 'visible' : ''}`"
			:title="$t('infoWindows.cryptomap.title')"
			:text="$t('infoWindows.cryptomap.text')"
			:url="$t('infoWindows.cryptomap.url')"
			:urlText="$t('infoWindows.cryptomap.urlText')"
			icon="icon-nimiq-logo-font"
		/>
		<!-- <InputSearchApi /> -->
		<!-- <ButtonFilter /> -->
		<!-- <ButtonResize /> -->
	</header>
</template>

<style lang="scss">
@import "@/assets/scss/mixins";
@import "@/assets/scss/variables";

header {
	box-shadow: var(--shadow-head);
	padding: $paddingBig;
	display: flex;
	align-items: center;
	gap: $paddingMed;
	position: relative;
	z-index: 1;

	> .nimiq-icon {
		cursor: pointer;
		padding: 0;

		.svg {
			min-width: 28px;
			width: 28px;
		}

		@include focusKeyAndHover() {
			& + .info-window {
				opacity: 1;
				visibility: visible;
			}
		}
	}

	input.search {
		width: 100%;
		border-radius: 20px;
	}

	button.resize {
		display: none;

		@include media("small") {
			display: inline-block;
		}
	}

	.info-window {
		top: calc(100% - $paddingMed);
		left: $paddingMed;

		.hover-helper {
			bottom: unset;
			top: -20px;
		}

		&:before {
			bottom: unset;
			left: $paddingSmall;
			top: -24px;
			left: 22px;
			transform: translate(-50%, 100%) rotate(180deg);
		}
	}
}
</style>