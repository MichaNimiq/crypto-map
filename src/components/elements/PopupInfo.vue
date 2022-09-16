<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue"

const props = defineProps<{
	title: string
	text: string
	url: string
	urlText: string
	icon: string
}>()
</script>

<template>
	<div class="info-window">
		<div class="hover-helper"></div>
		<div class="info-window-wrap">
			<div v-if="props.title" class="info-window-title">{{ props.title }}</div>
			<div v-if="props.text" class="info-window-text">{{ props.text }}</div>
			<div v-if="props.url && props.urlText" class="info-window-link">
				<a :href="props.url" :title="props.title" target="_blank" class="blue arrow"
					>{{ props.urlText }}<IconSvg iconIndex="icon-link-out"
				/></a>
			</div>
			<div v-if="icon" class="info-window-icon-wrap">
				<IconSvg :iconIndex="props.icon" class="info-window-icon" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/mixins.scss";

.info-window {
	position: absolute;
	max-width: 270px;
	background: radial-gradient(
		100% 100% at 100% 100%,
		var(--color-blue-dark-gradient-out) 0%,
		var(--color-blue-dark-gradient-in) 100%
	);
	color: var(--color-white);
	z-index: 9;
	padding: $paddingMed;
	border-radius: $borderRadiusBig;
	font-size: var(--font-size-label);
	opacity: 0;
	visibility: hidden;
	transition-property: opacity, visibility;
	transition-duration: $transition, $transition;
	transition-timing-function: ease, ease;

	&.visible {
		opacity: 1;
		visibility: visible;
	}

	@include focusKeyAndHover() {
		& {
			opacity: 1;
			visibility: visible;
		}
	}

	&:before {
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 100%);
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 12px solid var(--color-blue-dark-gradient-in);
	}

	.info-window-title {
		font-size: var(--font-size-body);
		font-weight: 700;
		margin-bottom: $paddingSmall;
	}

	.info-window-text {
		opacity: 0.6;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: $paddingSmall;
	}

	.info-window-icon-wrap {
		margin-top: $paddingMed;
		display: flex;
		justify-content: flex-end;
	}

	.hover-helper {
		position: absolute;
		bottom: -20px;
		height: 20px;
		width: 100%;
		left: 0;
	}
}
</style>
