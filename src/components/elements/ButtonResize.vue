<script setup lang="ts">
import { ref } from "vue";
import IconSvg from "@/components/elements/IconSvg.vue";

interface HTMLElement {
  requestFullscreen?: () => Promise<void>;
  msRequestFullScreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullScreen?: () => Promise<void>;
}

const isFullscreen = ref(false);

function toggleFullscreen() {
  isFullscreen.value ? exitFullscreen() : requestFullscreen();
  isFullscreen.value = !isFullscreen.value;
}

function requestFullscreen() {
  const elApp = document.querySelector("#app") as HTMLElement;
  if (elApp) {
    if (elApp.requestFullscreen) {
      elApp.requestFullscreen();
    } else if (elApp.webkitRequestFullScreen) {
      elApp.webkitRequestFullScreen();
    } else if (elApp.mozRequestFullScreen) {
      elApp.mozRequestFullScreen();
    } else if (elApp.msRequestFullScreen) {
      elApp.msRequestFullScreen();
    }
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
</script>

<template>
  <button
    class="secondary button icon resize"
    :class="`${isFullscreen ? 'fullscreen' : 'no-fullscreen'}`"
    @click="toggleFullscreen"
  >
    <IconSvg iconIndex="icon-expand" class="expand" />
    <IconSvg iconIndex="icon-shrink" class="shrink" />
  </button>
</template>
