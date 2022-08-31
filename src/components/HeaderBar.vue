<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
import InputSearchApi from "@/components/elements/InputSearchApi.vue";
import ButtonFilter from "@/components/elements/ButtonFilter.vue";
import ButtonResize from "@/components/elements/ButtonResize.vue";
</script>

<template>
  <header id="the-header">
    <IconSvg
      iconIndex="icon-nim"
      class="nimiq-icon"
    />
    <InputSearchApi />
    <ButtonFilter />
    <ButtonResize />
  </header>
</template>
