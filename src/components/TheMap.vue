<script setup lang="ts">
import Button from "@/components/elements/Button.vue"
import EstablishmentIcon from "@/components/icons/icon-establishment.vue"
import MinusIcon from "@/components/icons/icon-minus.vue"
import PlusIcon from "@/components/icons/icon-plus.vue"
import TheMapInstance from "@/components/TheMapInstance.vue"
</script>

<template>
	<!-- TODO Aria with the controls -->
	<main class="h-full" ref="mapWrapper">
		<TheMapInstance>
			<template #button-calculate-position="{ navigateToUserEstablishment }">
				<Button @click="navigateToUserEstablishment" style="width: 34px; height: 34px" bgColor="white" size="sm"
					draggable="false" aria-label="Show your establishment" title="Show your establishment">
					<template #icon>
						<EstablishmentIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-in="{ zoomIn }">
				<Button @click="zoomIn" style="width: 34px; height: 34px" class="rounded-b-0" bgColor="white" size="sm"
					draggable="false" aria-label="Zoom in" title="Zoom in">
					<template #icon>
						<PlusIcon />
					</template>
				</Button>
			</template>

			<template #button-zoom-out="{ zoomOut }">
				<Button @click="zoomOut" style="width: 34px; height: 34px" class="rounded-t-0" bgColor="white" size="sm"
					draggable="false" aria-label="Zoom out" title="Zoom out">
					<template #icon>
						<MinusIcon />
					</template>
				</Button>
			</template>
		</TheMapInstance>
		<Button class="absolute bottom-5 md:bottom-6 right-5 md:right-6 shadow" bgColor="white" href="/establishment/add"
			size="md" text-color="ocean" draggable="false" aria-label="Add establishment" title="Add establishment">
			<template #text> Add establishment </template>
		</Button>
	</main>
</template>
