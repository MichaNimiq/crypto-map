<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { filterListVisible } from "@/globals";
import googleMapsHelperInstance from "@/google-maps-helper";
import ButtonMapAddLocation from "@/components/elements/ButtonMapAddLocation.vue";
import ButtonMapShowList from "@/components/elements/ButtonMapShowList.vue";
import ButtonMapControls from "@/components/elements/ButtonMapControls.vue";

const route = useRoute();

const mapWrapper = ref<HTMLInputElement | null>(null);
const theMap = ref<HTMLInputElement | null>(null);

onMounted(() => {
  googleMapsHelperInstance.elementMapWrapper = mapWrapper.value;
  googleMapsHelperInstance.elementMap = theMap.value;

  if (
    typeof route.params.lat !== "undefined" &&
    typeof route.params.lng !== "undefined"
  )
    googleMapsHelperInstance.center = {
      lat: parseFloat(route.params.lat.toString()),
      lng: parseFloat(route.params.lng.toString()),
    };

  googleMapsHelperInstance.init();
});

function clickShowList() {
  filterListVisible.value = !filterListVisible.value;

  if (window.innerWidth <= 768){
    const elList = document.querySelector('#map-list-wrap');
    elList?.scrollTo({
      top: 350,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <main
    id="map-wrapper"
    ref="mapWrapper"
    :class="`${filterListVisible ? 'partial' : 'maximized'}`"
  >
    <div id="the-map" ref="theMap"></div>
    <ButtonMapAddLocation />
    <ButtonMapShowList
      @click="clickShowList"
    />
    <ButtonMapControls />
  </main>
</template>
