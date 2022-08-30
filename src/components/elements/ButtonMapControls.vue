<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
</script>

<template>
  <div class="map-controls">
    <button class="button location">
      <IconSvg iconIndex="icon-location" />
    </button>
    <div class="zoom-wrap">
      <button class="button zoom in">
        <IconSvg iconIndex="icon-plus" />
      </button>
      <button class="button zoom out">
        <IconSvg iconIndex="icon-minus" />
      </button>
    </div>
  </div>
</template>
