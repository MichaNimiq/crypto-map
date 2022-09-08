<script setup lang="ts">
import debug from "@/debug";
import { filterVisible, cryptoCurrencies, locationTypes } from "@/globals";
import type { selectEntry } from "@/interfaces";
import { ref } from "vue";
import IconSvg from "@/components/elements/IconSvg.vue";
import SelectBoxMultiple from "@/components/elements/SelectBoxMultiple.vue";
import { onClickOutside } from "@vueuse/core";

const elModalBox = ref(null);

onClickOutside(elModalBox, (event: Event) => {
  debug(event);
  filterVisible.value = false;
});
</script>

<template>
  <div
    class="overlay"
    :class="`${filterVisible ? 'visible' : ''}`"
    id="filter-overlay"
  >
    <div class="overlay-wrap">
      <div class="modal-box" ref="elModalBox">
        <IconSvg
          iconIndex="icon-close"
          class="close"
          @click="filterVisible = false"
        />
        <div class="modal-row">
          <h2 class="headline-modal">{{ $t("labels.button-filter") }}</h2>
        </div>
        <div class="modal-row">
          <SelectBoxMultiple
            :label="$t('labels.select-crypto')"
            :placeholder="$t('labels.select-crypto-button')"
            :entries="cryptoCurrencies"
            merchantVariable="cryptoCurrencies"
            :showAttr="true"
            :icons="true"
          />
        </div>
        <div class="modal-row">
          <SelectBoxMultiple
            :label="$t('labels.select-location')"
            :placeholder="$t('labels.select-location-button')"
            :entries="locationTypes"
            merchantVariable="locationTypes"
          />
        </div>
      </div>
    </div>
  </div>
</template>
