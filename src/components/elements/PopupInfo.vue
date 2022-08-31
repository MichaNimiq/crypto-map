<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";

const props = defineProps<{
  title: string;
  text: string;
  url: string;
  urlText: string;
  icon: string
}>();
</script>

<template>
  <div class="info-window">
    <div class="hover-helper"></div>
    <div class="info-window-wrap">
      <div v-if="props.title" class="info-window-title">{{ props.title }}</div>
      <div v-if="props.text" class="info-window-text">{{ props.text }}</div>
      <div v-if="props.url && props.urlText" class="info-window-link">
        <a
          :href="props.url"
          :title="props.title"
          target="_blank"
          class="blue arrow"
        >{{ props.urlText }}<IconSvg iconIndex="icon-link-out" /></a>
      </div>
      <div v-if="icon" class="info-window-icon-wrap">
        <IconSvg
          :iconIndex="props.icon"
          class="info-window-icon"
        />
      </div>
    </div>
  </div>
</template>
