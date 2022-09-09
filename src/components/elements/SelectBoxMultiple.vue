<script setup lang="ts">
import debug from "@/debug";
import { ref } from "vue";
import { useI18n } from 'vue-i18n'
import messages from "@/translatables";
import type { selectEntry } from "@/interfaces";
import IconSvg from "@/components/elements/IconSvg.vue";
import { onClickOutside } from "@vueuse/core";
import merchant_map_client_instance from "@/merchant-map-client";

const { t } = useI18n({messages: messages});

const props = defineProps<{
  label?: string;
  placeholder: string;
  prefix?: string;
  entries: string[];
  merchantVariable?: string;
  showAttr?: boolean; // as the object should have an ID and a description, this defines if also the ID should be shown
  icons?: boolean; // should an icon be shown (dynamically, depending on the ID)
}>();

const entryString: string = (props.prefix ? props.prefix+'-' : '');
const elButtonSelect = ref(null);
const selectOpen = ref<boolean>(false);
const selectedValues = ref<boolean[]>([]);

function toggleOpen(bState: boolean = selectOpen.value) {
  selectOpen.value = !bState;
}

function toggleSelected(id: number | null = null) {
  if (id == null) {
    debug(["toggleSelected", "no id given"]);
    return false;
  }

  selectedValues.value[id] = !selectedValues.value[id];

  if (props.merchantVariable) {
    merchant_map_client_instance[props.merchantVariable] = []; // todo: better way to access?
    
    for (const key in selectedValues.value) {
      const element = selectedValues.value[key];

      if (element){
        merchant_map_client_instance[props.merchantVariable].push( // todo: better way to access?
          {
            id: props.entries[key],
            name: t(`selectEntries.${entryString}${props.entries[key].toLowerCase()}`)
          }
        )
      }
    }
  }

  debug(['selected entries', merchant_map_client_instance[props.merchantVariable]])
  
  return true;
}

onClickOutside(elButtonSelect, (event: Event) => {
  selectOpen.value = false;
});
</script>

<template>
  <div class="select-wrap">
    <label v-if="props.label">{{ props.label }}</label>
    <button
      class="select"
      :class="`${selectOpen ? 'open' : ''}`"
      ref="elButtonSelect"
    >
      <div class="button-placeholder" @click="toggleOpen()">
        {{ props.placeholder }}
        <IconSvg iconIndex="icon-arrow-select" />
      </div>
      <div class="select-options">
        <option
          v-for="(entry, index) in props.entries"
          :key="index"
          class="select-option"
          :class="`${selectedValues[index] ? 'selected' : ''}`"
          :selected="selectedValues[index]"
          @click="toggleSelected(index)"
        >
          <div class="select-icon-name-flex-wrap">
            <div v-if="props.icons" class="select-icon">
              <IconSvg :iconIndex="`icon-${entry.toLowerCase()}`" />
            </div>
            <div class="select-name">
              <div v-if="props.showAttr" class="select-ident">
                {{ entry }}
              </div>
              <div class="select-desc">
                {{ $t(`selectEntries.${entryString}${entry.toLowerCase()}`) }}
              </div>
            </div>
          </div>
          <div class="select-radio">
            <div class="radio-fill"></div>
          </div>
        </option>
      </div>
    </button>
    <div class="tag-list">
      <div
        v-for="(entry, index) in props.entries"
        :key="index"
        class="tag-item"
        :class="`${selectedValues[index] ? 'selected' : ''}`"
        :selected="selectedValues[index]"
        @click="toggleSelected(index)"
      >
        <div class="select-name" v-html="$t(`selectEntries.${entryString}${entry.toLowerCase()}`)"></div>
        <IconSvg iconIndex="icon-close" class="close" />
      </div>
    </div>
  </div>
</template>
