<script setup lang="ts">
import debug from "@/debug";
import { filterVisible } from "@/globals";
import type { selectEntry } from "@/interfaces";
import { ref } from "vue";
import IconSvg from "@/components/elements/IconSvg.vue";
import SelectBoxMultiple from "@/components/elements/SelectBoxMultiple.vue";
import { onClickOutside } from "@vueuse/core";
import cryptoCurrencies from "@/currencies";

const elModalBox = ref(null);
const selectCryptoValues: selectEntry[] = [];

for (const key in cryptoCurrencies) {
  if (Object.prototype.hasOwnProperty.call(cryptoCurrencies, key)) {
    // currenciesSelectedValues.value[cryptoCurrencies[key].id] = false;
    selectCryptoValues.push({
      id: cryptoCurrencies[key].id,
      name: cryptoCurrencies[key].name,
    });
  }
}

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
            label="labels.select-crypto-button"
            :entries="selectCryptoValues"
            :showAttr="true"
            :icons="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
