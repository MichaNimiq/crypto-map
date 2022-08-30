<script setup lang="ts">
import debug from "@/debug";
import { ref } from "vue";
import type { selectEntry } from "@/interfaces";
import IconSvg from "@/components/elements/IconSvg.vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  label: string;
  entries: selectEntry[];
  showAttr: boolean;
  icons: boolean;
}>();

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

  return true;
}

onClickOutside(elButtonSelect, (event: Event) => {
  debug(event);
  selectOpen.value = false;
});
</script>

<template>
  <div class="select-wrap">
    <label for="modal-filter-crypto">{{ $t("labels.select-crypto") }}</label>
    <button
      id="modal-filter-crypto"
      class="select select-crypto"
      :class="`${selectOpen ? 'open' : ''}`"
      ref="elButtonSelect"
    >
      <div class="button-label" @click="toggleOpen()">
        {{ $t(props.label) }}
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
          <div v-if="props.icons" class="select-icon">
            <IconSvg :iconIndex="`icon-${entry.id}`" />
          </div>
          <div class="select-name">
            <span v-if="props.showAttr" class="select-ident">
              {{ entry.id }}
            </span>
            {{ entry.name }}
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
        <div class="select-name" v-html="entry.name"></div>
        <IconSvg iconIndex="icon-close" class="close" />
      </div>
    </div>
  </div>
</template>
