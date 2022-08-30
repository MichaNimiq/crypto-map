<script setup lang="ts">
import { filterVisible } from "@/globals";
import IconSvg from "@/components/elements/IconSvg.vue";
</script>

<template>
  <button class="secondary button icon" @click="filterVisible = true">
    <IconSvg iconIndex="icon-filter" />
    <span class="button-label">{{ $t("labels.button-filter") }}</span>
  </button>
</template>
