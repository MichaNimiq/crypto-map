<script setup lang="ts">
  import debug from "@/debug";
import IconSvg from "@/components/elements/IconSvg.vue";
import googleMapsHelperInstance from "@/google-maps-helper";
import { onMounted, ref, reactive } from "vue";
import messages from "@/translatables";
import { useI18n } from 'vue-i18n'

const { t } = useI18n({messages: messages});

let autocomplete = null; // todo: type?
const autocompleteElement = ref<HTMLElement>();
const placeData = reactive<{
  place: any,
  imageUrl: string,
  locationTypes: Set<string>
}>({
  place: null,
  imageUrl: '',
  locationTypes: new Set()
});

onMounted(async () => {
  const google = await googleMapsHelperInstance.loader.load();
  autocomplete = new google.maps.places.SearchBox(
    autocompleteElement.value,
    { types: ["geocode"] }
  );
  autocomplete.addListener("places_changed", () => {
    const places = autocomplete.getPlaces();

    // no multi-select, so only one place to get
    if (places.length > 0) {
      placeData.place = places[0];

      debug(placeData.place)

      if (placeData.place.photos)
        placeData.imageUrl = placeData.place
          ? placeData.place.photos[0].getUrl()
          : null;
      
      if (placeData.place.types.length > 0) {
        for (const key in placeData.place.types) {
          if (Object.prototype.hasOwnProperty.call(placeData.place.types, key)) {
            const type = placeData.place.types[key];
            placeData.locationTypes.add(t(`selectEntries.${type}`))
          }
        }
      }
    } else {
      placeData.place = null;
      placeData.imageUrl = '';
      placeData.locationTypes = new Set();
    }
  });
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
    <IconSvg
      class="magnifier"
      iconIndex="icon-search"
    />
    <div
      v-if="placeData.place !== null"
      class="places-resultset"
    >
      <div class="name" v-html="placeData.place.name"></div>
      <div class="address" v-html="placeData.place.adr_address"></div>
      <div class="rating-location">
        <div
          v-if="placeData.place.rating > 0"
          class="stars-wrap"
        >
          <IconSvg
            v-for="key in parseInt(placeData.place.rating)"
            :key="key"
            :iconIndex="`icon-rating-star`"
          />
        </div>
        <div
          v-if="placeData.locationTypes.size > 0"
          class="location-types"
        >
          <span v-for="locationType in placeData.locationTypes" :key="locationType">{{ locationType }}</span>
        </div>
      </div>
      <div
        v-if="placeData.imageUrl !== ''"
        class="image-wrap"
      >
        <img :src="placeData.imageUrl" />
      </div>
    </div>
  </div>
</template>
