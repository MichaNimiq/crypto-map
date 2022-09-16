<template>
	<component
		:is="getComponent()"
		:to="!isExternalLink ? props.href : undefined"
		:href="isExternalLink ? props.href : undefined"
		:target="isExternalLink ? '_blank' : undefined"
		class="group flex items-center justify-center w-max rounded-full cursor-pointer outline-none transition-colors"
		v-bind="$attrs"
		:disabled="isDisabled"
		:class="{
			'bg-space': props.bgColor === 'space',
			'bg-sky': props.bgColor === 'sky',
			'border-2 border-space/[0.15]': ['white', 'transparent'].includes(props.bgColor),
			'bg-white hover:bg-grey': props.bgColor === 'white',
			'bg-space/10': props.bgColor === 'grey',
			'py-2.5 px-4 sm:py-3 sm:px-5 sm:h-10 gap-3': props.size === 'lg',
			'px-2 sm:px-2.5 h-[22px] sm:h-6 gap-2': props.size === 'sm',
			'focus-visible:ring-offset-2': props.as !== 'div' && props.bgColor === 'space',
			'focus-visible:ring-space focus-visible:ring-1': props.as !== 'div',
			'group-button-focus-visible:ring-offset-2': props.as === 'div' && props.bgColor === 'space',
			'group-button-focus-visible:ring-space group-button-focus-visible:ring-1': props.as === 'div',
		}"
	>
		<span
			v-if="hasSlot('icon')"
			:class="{
				'text-white/60': ['space', 'sky'].includes(props.bgColor),
				'text-space/60': ['white', 'transparent', 'grey'].includes(props.bgColor),
				'text-opacity-40': isDisabled,
			}"
		>
			<slot name="icon" />
		</span>
		<span
			v-if="hasSlot('text')"
			class="font-extrabold text-center whitespace-nowrap"
			:class="{
				'text-white [button:disabled>&]:!text-white/40': ['space', 'sky'].includes(props.bgColor),
				'text-space': ['white', 'grey'].includes(props.bgColor),
				'text-space/60': props.bgColor === 'transparent',
				'text-opacity-40': isDisabled,
				'text-sm md:text-base': props.size === 'lg',
				'text-11 md:text-xs': props.size === 'sm',
			}"
		>
			<slot name="text" />
		</span>

		<transition name="loading">
			<CircleSpinner
				v-if="props.loading"
				:class="{
					'text-white': !['transparent', 'white'].includes(props.bgColor),
					'text-space/60': ['transparent', 'white'].includes(props.bgColor),
					'w-3 h-3': props.size === 'sm',
				}"
			/>
		</transition>
	</component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, useSlots } from "vue"

const CircleSpinner = defineAsyncComponent(
	() => import("@/components/icons/icon-circle-spinner.vue")
)

const props = defineProps({
	bgColor: {
		type: String as () => "space" | "transparent" | "white" | "sky" | "grey",
		default: () => "space",
	},
	type: {
		type: String,
		default: undefined,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	href: {
		type: String,
		default: undefined,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	as: {
		type: String,
		default: undefined,
	},
	size: {
		type: String as () => "sm" | "lg",
		default: "lg",
	},
})

const isDisabled = computed(() => props.disabled || props.loading)

const slots = useSlots()
const hasSlot = (name: "icon" | "text") => {
	return !!slots[name]
}

const isExternalLink = computed(() => !!props.href?.startsWith("http"))
function getComponent() {
	if (props.as) return props.as
	if (!props.href) return "button"
	if (isExternalLink.value) return "a"
	return "router-link"
}
</script>

<style scoped>
.loading-enter-active {
	animation: loading-in 400ms ease-out;
}

.loading-leave-active {
	animation: loading-in 300ms ease-in reverse;
}

@keyframes loading-in {
	0% {
		transform: scale(0);
		margin-left: -12px;
		width: 0;
	}

	40% {
		transform: scale(0);
		margin-left: 0;
		width: unset;
	}

	100% {
		transform: scale(1);
		margin-left: 0;
		width: unset;
	}
}
</style>