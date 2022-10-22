<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import LocationIcon from "@/components/icons/icon-location.vue"
import MinusIcon from "@/components/icons/icon-minus.vue"
import PlusIcon from "@/components/icons/icon-plus.vue"
import TheMapInstance from "@/components/TheMapInstance.vue"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

const { greater } = useBreakpoints(breakpointsTailwind)
const isXlScreen = greater("xl")
</script>

<template>
	<!-- TODO Aria with the controls -->
	<main class="h-full" ref="mapWrapper">
		<TheMapInstance>
			<template #button-calculate-position="{ navigateToUserLocation }">
				<Button
					@click="navigateToUserLocation"
					style="width: 34px; height: 34px"
					bgColor="white"
					size="sm"
				>
					<template #icon>
						<LocationIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-in="{ zoomIn }">
				<Button
					@click="zoomIn"
					style="width: 34px; height: 34px"
					class="rounded-b-0"
					bgColor="white"
					size="sm"
				>
					<template #icon>
						<PlusIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-out="{ zoomOut }">
				<Button
					@click="zoomOut"
					style="width: 34px; height: 34px"
					class="rounded-t-0"
					bgColor="white"
					size="sm"
				>
					<template #icon>
						<MinusIcon />
					</template>
				</Button>
			</template>
		</TheMapInstance>
		<Button
			class="absolute bottom-5 md:bottom-6 right-5 md:right-6 shadow"
			bgColor="white"
			href="/location/add"
			size="md"
			text-color="ocean"
		>
			<template #text> Add crypto location </template>
		</Button>
	</main>
</template>
