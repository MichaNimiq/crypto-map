<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
import InputSearchApi from "@/components/elements/InputSearchApi.vue";
import ButtonFilter from "@/components/elements/ButtonFilter.vue";
import ButtonResize from "@/components/elements/ButtonResize.vue";
import PopupInfo from "@/components/elements/PopupInfo.vue";
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

let infoVisible = ref<boolean>(false);
const elInfoWindow = ref(null);

onClickOutside(elInfoWindow, () => {
  infoVisible.value = false;
});
</script>

<template>
  <header id="the-header">
    <button 
      class="nimiq-icon"
    >
      <IconSvg
        iconIndex="icon-nim"
        @click="() => { infoVisible = !infoVisible }"
      />
    </button>
    <PopupInfo
      ref="elInfoWindow"
      :class="`${infoVisible ? 'visible' : ''}`"
      :title="$t('infoWindows.cryptomap.title')"
      :text="$t('infoWindows.cryptomap.text')"
      :url="$t('infoWindows.cryptomap.url')"
      :urlText="$t('infoWindows.cryptomap.urlText')"
      icon="icon-nimiq-logo-font"
    />
    <InputSearchApi />
    <ButtonFilter />
    <ButtonResize />
  </header>
</template>
