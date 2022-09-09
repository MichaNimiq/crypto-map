<script setup lang="ts">
import debug from "@/debug";
import { reportIssueVisible, issueTypes } from "@/globals";
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
    :class="`${reportIssueVisible ? 'visible' : ''}`"
    id="filter-overlay"
  >
    <div class="overlay-wrap">
      <div class="modal-box modal-fullscreen" ref="elModalBox">
        <IconSvg
          iconIndex="icon-close"
          class="close"
          @click="reportIssueVisible = false"
        />
        <div class="modal-row content-row">
          <h2 class="h1 headline-modal">{{ $t("infoWindows.reportIssue.title") }}</h2>
        </div>
        <div class="modal-row form-row">
          <InputSearchGooglePlaces />
        </div>
        <div class="modal-row form-row">
          <SelectBoxMultiple
            :label="$t('labels.select-issue')"
            :placeholder="$t('labels.select-issue')"
            :entries="issueTypes"
            prefix="issue"
          />
        </div>
        <div class="modal-row form-row">
          <div class="input-wrap">
            <label>{{ $t('labels.describe-issue')}}</label>
            <textarea class="textarea" />
          </div>
        </div>
        <div class="modal-row form-row">
          <div class="button-wrap">
            <button
              class="button secondary"
              @click="reportIssueVisible = false"
            >{{ $t('labels.cancel')}}</button>
            <button class="button primary">{{ $t('labels.report-issue')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
