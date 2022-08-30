<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
</script>

<template>
  <button class="button show-list">
    <IconSvg iconIndex="icon-list" />
    <span class="button-label">{{ $t("labels.button-show-list") }}</span>
  </button>
</template>
