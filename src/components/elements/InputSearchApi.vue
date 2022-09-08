<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
import merchant_map_client_instance from "@/merchant-map-client";
import { ref } from "vue";

// TODO
// don't use the coords for the text search and filter for everything

const autocompleteElement = ref(null);

let typingTimeout: number | undefined = undefined;

const currentValue = "";

function onInput(event: Event) {
  if (!autocompleteElement.value) return false;

  const inputElement = autocompleteElement.value as HTMLInputElement;

  // workaround as the event would also fire when we input things
  // and then remove the focus from it (triggering the change event)
  // so for not calling unnecessary API calls, checking if the value
  // really changed on the change event
  if (event.type == "change") {
    const elementChanged = event.target as HTMLInputElement;

    if (elementChanged.value == inputElement.value) return false;
  }

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    merchant_map_client_instance.searchString = inputElement.value;

    merchant_map_client_instance.getResults();
  }, 400);
}
</script>

<template>
  <div class="input-search-wrap">
    <div class="input-icon-wrap">
      <input
        type="text"
        class="search search-places"
        ref="autocompleteElement"
        :placeholder="$t('placeholders.search-places')"
        @change="onInput"
        @input="onInput"
        v-model="currentValue"
      />
      <IconSvg
        iconIndex="icon-search"
        class="magnifier"
      />
    </div>
  </div>
</template>
