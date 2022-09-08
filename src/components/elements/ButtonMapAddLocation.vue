<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
import { addLocationVisible, reportIssueVisible } from "@/globals";
</script>

<template>
  <button class="button add-location">
    <span class="button-label"
      @click="addLocationVisible = !addLocationVisible"
    >{{ $t("labels.button-add-location") }}</span>
    <div class="icon-wrap"
      @click="reportIssueVisible = !reportIssueVisible"
    >
      <IconSvg iconIndex="icon-flag" />
    </div>
  </button>
</template>
