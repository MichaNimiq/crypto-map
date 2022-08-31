<script setup lang="ts">
import debug from "@/debug";
import IconSvg from "@/components/elements/IconSvg.vue";
import cryptoCurrencies from "@/currencies";
import { reactive } from "vue";
import googleMapsHelperInstance from "@/google-maps-helper";
import { selectedId } from "@/globals";
import type { itemData, pickupData } from "@/interfaces";

const props = defineProps<{
  itemData: itemData;
}>();

const mapsKey: string = import.meta.env.VITE_GOOGLE_MAP_KEY;

// workaround as long as we don't have a proper JSON object
// debug(props.itemData);

const pickups = reactive<pickupData[]>(props.itemData.pickups);
const shippings = reactive<pickupData[]>(props.itemData.shippings);

for (const keyInner in pickups) {
  if (Object.prototype.hasOwnProperty.call(pickups, keyInner)) {
    if (pickups[keyInner].place_information) {
      pickups[keyInner].place_information_parsed = pickups[keyInner]
        .place_information
        ? JSON.parse(pickups[keyInner].place_information)
        : null;
    }
  }
}

for (const keyInner in shippings) {
  if (Object.prototype.hasOwnProperty.call(shippings, keyInner)) {
    if (shippings[keyInner].place_information) {
      shippings[keyInner].place_information_parsed = shippings[keyInner]
        .place_information
        ? JSON.parse(shippings[keyInner].place_information)
        : null;
    }
  }
}

let imageRef: string | null = null;

// getting the first best image for now as we currently display
// only one list-item for all locations of one place
if (pickups.length > 0) {
  if (pickups[0].place_information_parsed.photos) {
    imageRef = pickups[0].place_information_parsed.photos[0].photo_reference;
  }
} else {
  if (shippings[0].place_information_parsed.photos) {
    imageRef = shippings[0].place_information_parsed.photos[0].photo_reference;
  }
}

const imageUrl: string | null = imageRef
  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${imageRef}&key=${mapsKey}`
  : "/img/place-placeholder.jpg";
</script>

<template>
  <button
    class="list-item card"
    :class="`${selectedId == props.itemData.id ? 'selected' : ''}`"
    :id="`list-item-${props.itemData.id}`"
    :data-id="props.itemData.id"
    @click="googleMapsHelperInstance.selectPopup(props.itemData.id)"
  >
    <div class="item-image">
      <img :src="imageUrl" loading="lazy" />
    </div>
    <div class="item-content">
      <div class="item-label">{{ props.itemData.label }}</div>
      <div class="item-addresses">
        <div v-for="item in pickups" :key="item.id" :id="`pickup-${item.id}`">
          <div v-if="item.place_information_parsed" class="item-address">
            {{ item.place_information_parsed.formatted_address }}
          </div>
        </div>
        <div v-for="item in shippings" :key="item.id" :id="`pickup-${item.id}`">
          <div v-if="item.place_information_parsed" class="item-address">
            {{ item.place_information_parsed.formatted_address }}
          </div>
        </div>
        <div class="item-currencies">
          <div
            v-for="item in cryptoCurrencies"
            :key="item.id"
            class="item-currency"
          >
            <IconSvg :iconIndex="`icon-${item.id}`" />
          </div>
        </div>
      </div>
    </div>
  </button>
</template>
