<script setup lang="ts">
import IconSvg from "@/components/elements/IconSvg.vue";
import googleMapsHelperInstance from "@/google-maps-helper";
import { onMounted, ref } from "vue";

const autocomplete = ref(null);
const autocompleteElement = ref(null);

onMounted(async () => {
  const google = await googleMapsHelperInstance.loader.load();
  autocomplete.value = new google.maps.places.SearchBox(
    autocompleteElement.value,
    { types: ["geocode"] }
  );
});
</script>

<template>
  <div class="input-search-wrap">
    <input
      type="text"
      class="search search-places"
      ref="autocompleteElement"
      :placeholder="$t('placeholders.search-places')"
    />
    <IconSvg iconIndex="icon-search" />
  </div>
</template>
