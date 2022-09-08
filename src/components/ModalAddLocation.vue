<script setup lang="ts">
import debug from "@/debug";
import { addLocationVisible, cryptoCurrencies, locationTypes } from "@/globals";
import type { selectEntry } from "@/interfaces";
import IconSvg from "@/components/elements/IconSvg.vue";
import { ref } from "vue";
import InputSearchGooglePlaces from "./elements/InputSearchGooglePlaces.vue";
import SelectBoxMultiple from "@/components/elements/SelectBoxMultiple.vue";
// import merchant_map_client_instance from "@/merchant-map-client";

const elModalBox = ref(null);
</script>

<template>
  <div
    class="overlay overlay-fullscreen"
    :class="`${addLocationVisible ? 'visible' : ''}`"
    id="filter-overlay"
  >
    <div class="overlay-wrap">
      <div class="modal-box modal-fullscreen" ref="elModalBox">
        <IconSvg
          iconIndex="icon-close"
          class="close"
          @click="addLocationVisible = false"
        />
        <div class="modal-row content-row">
          <h2 class="h1 headline-modal">{{ $t("infoWindows.addLocation.title") }}</h2>
          <p class="subline">{{ $t("infoWindows.addLocation.text") }}</p>
          <div class="button-wrap">
            <a
              :href="$t('infoWindows.addLocation.url')"
              :title="$t('infoWindows.addLocation.urlText')"
              target="_blank"
              class="blue arrow"
            >{{ $t("infoWindows.addLocation.urlText") }}<IconSvg iconIndex="icon-link-out" /></a>
          </div>
        </div>
        <div class="modal-row form-row">
          <InputSearchGooglePlaces />
        </div>
        <div class="modal-row form-row">
          <SelectBoxMultiple
            :label="$t('labels.select-crypto')"
            :placeholder="$t('labels.select-crypto-button')"
            :entries="cryptoCurrencies"
            merchantVariable="cryptoCurrencies"
            :showAttr="true"
            :icons="true"
          />
        </div>
        <div class="modal-row form-row">
          <div class="button-wrap">
            <button
              class="button secondary"
              @click="addLocationVisible = false"
            >{{ $t('labels.cancel')}}</button>
            <button class="button primary">{{ $t('labels.submit-place')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
