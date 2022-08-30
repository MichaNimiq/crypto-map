<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
</script>

<template>
  <button class="button add-location">
    <span class="button-label">{{ $t("labels.button-add-location") }}</span>
    <div class="icon-wrap">
      <IconSvg iconIndex="icon-flag" />
    </div>
  </button>
</template>
