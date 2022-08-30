<script setup lang="ts">
import "./assets/scss/main.scss";

import "@/globals";

import HeaderBar from "@/components/HeaderBar.vue";
import TheMap from "@/components/TheMap.vue";
import TheList from "@/components/TheList.vue";
import ModalFilter from "@/components/ModalFilter.vue";
</script>

<template>
  <div id="content-wrap">
    <HeaderBar />
    <div id="map-list-wrap">
      <TheMap />
      <TheList />
    </div>
    <ModalFilter />
  </div>
</template>
