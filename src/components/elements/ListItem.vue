<script setup lang="ts">
import debug from "@/debug";
import IconSvg from "@/components/elements/IconSvg.vue";
import { reactive } from "vue";
import googleMapsHelperInstance from "@/google-maps-helper";
import { selectedId, cryptoCurrencies, getLocationTypeString } from "@/globals";
import type { itemData, pickupData, boundingBox, coords } from "@/interfaces";
import messages from "@/translatables";
import { useI18n } from 'vue-i18n'

const { t } = useI18n({messages: messages});

const props = defineProps<{
  itemData: itemData;
}>();

const mapsKey: string = import.meta.env.VITE_GOOGLE_MAP_KEY;

let singlePlaceUrl: string | null = null;
let singlePlaceRating: number | null = null;
let locationTypes = new Set();

// workaround as long as we don't have a proper JSON object

const pickups = reactive<pickupData[]>(props.itemData.pickups);
const shippings = reactive<pickupData[]>(props.itemData.shippings);

let boundingBoxOfAllLocations: boundingBox = {
  swLat: null,
  swLng: null,
  neLat: null,
  neLng: null
};

let numberLocations: number = 0;

let imageRef: string | null = null;

function setBoundingBox( locationData: coords ) {
  if (
    typeof locationData.lat == 'undefined' ||
    typeof locationData.lng == 'undefined'
  )
    return false;

  if (locationData.lat <= boundingBoxOfAllLocations.swLat || boundingBoxOfAllLocations.swLat == null)
    boundingBoxOfAllLocations.swLat = locationData.lat;

  if (locationData.lng <= boundingBoxOfAllLocations.swLng || boundingBoxOfAllLocations.swLng == null)
    boundingBoxOfAllLocations.swLng = locationData.lng;

  if (locationData.lat >= boundingBoxOfAllLocations.neLat || boundingBoxOfAllLocations.neLat == null)
    boundingBoxOfAllLocations.neLat = locationData.lat;

  if (locationData.lng <= boundingBoxOfAllLocations.neLng || boundingBoxOfAllLocations.neLng == null)
    boundingBoxOfAllLocations.neLng = locationData.lng;
}

function selectEntry(){
  googleMapsHelperInstance.navigateItem(boundingBoxOfAllLocations, numberLocations);
  selectedId.value = props.itemData.id;
}

/* 
  currently the JSON place_information is a simple string and needs to get parsed
  the next server version will have this as a proper object
  as of today this is not live, yet

  one place could in theory hold multiple addresses (pickups[] and shippings[])
  so for now I loop through all of them, gather the addresses of the indivitual addresses
  and print them out in one parent list item.

  the list item will then reflect only one location but could contain multiple
  addresses.
  when we click on a list item the map will get all the location points and calculates
  the center of them (see google-maps-helper navigateItem()).

  TODO: perhaps we then should hide all the other markers and when clicking somewhere else
  on the map the other markers appear again
*/
for (const keyInner in pickups) {
  if (Object.prototype.hasOwnProperty.call(pickups, keyInner)) {
    if (pickups[keyInner].place_information) {
      pickups[keyInner].place_information_parsed = pickups[keyInner]
        .place_information
        ? JSON.parse(pickups[keyInner].place_information)
        : null;

      if (pickups[keyInner].place_information_parsed) {
        setBoundingBox(pickups[keyInner].place_information_parsed.geometry.location);

        if (pickups[keyInner].place_information_parsed.types.length > 0) {
          for (const key in pickups[keyInner].place_information_parsed.types) {
            if (Object.prototype.hasOwnProperty.call(pickups[keyInner].place_information_parsed.types, key)) {
              const type = getLocationTypeString(t(`selectEntries.type-${pickups[keyInner].place_information_parsed.types[key]}`));
              if (type)
                locationTypes.add(type);
            }
          }
        }

        if (numberLocations == 0){
          if (pickups[keyInner].place_information_parsed.rating)
            singlePlaceRating = pickups[keyInner].place_information_parsed.rating;

          if (pickups[keyInner].place_information_parsed.url)
            singlePlaceUrl = pickups[keyInner].place_information_parsed.url;
        }

        numberLocations++;
      }
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

      if (shippings[keyInner].place_information_parsed) {
        setBoundingBox(shippings[keyInner].place_information_parsed.geometry.location);

        if (shippings[keyInner].place_information_parsed.types.length > 0) {
          for (const key in shippings[keyInner].place_information_parsed.types) {
            if (Object.prototype.hasOwnProperty.call(shippings[keyInner].place_information_parsed.types, key)) {
              const type = getLocationTypeString(t(`selectEntries.type-${shippings[keyInner].place_information_parsed.types[key]}`));
              if (type)
                locationTypes.add(type);
            }
          }
        }

        if (numberLocations == 0){
          if (shippings[keyInner].place_information_parsed.rating)
            singlePlaceRating = shippings[keyInner].place_information_parsed.rating;

          if (shippings[keyInner].place_information_parsed.url)
            singlePlaceUrl = shippings[keyInner].place_information_parsed.url;
        }

        numberLocations++;
      }
    }
  }
}

if (numberLocations > 1) {
  singlePlaceRating = null;
  singlePlaceUrl = null;
}

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
    :data-boundingBox="JSON.stringify(boundingBoxOfAllLocations)"
    :data-locations="numberLocations"
    @click="selectEntry"
  >
    <div class="item-image">
      <img :src="imageUrl" loading="lazy" />
    </div>
    <div class="item-content">
      <div class="item-label">
        <div class="item-label-text">{{ props.itemData.label }}</div>
        <div
          v-if="singlePlaceUrl !== null"
          class="item-label-link"
        >
          <a
            :href="singlePlaceUrl"
            :title="`${$t('labels.visit')} ${props.itemData.label} ${$t('labels.on-google-maps')}`"
            target="_blank"
          >
            <IconSvg
              :iconIndex="`icon-google-g`"
              class="google-g"
            />
          </a>
        </div>
      </div>
      <div
        v-if="locationTypes.size > 0"
        class="item-types"
      >
        <div class="types-wrap">
          <span v-for="locationType in locationTypes" :key="locationType">{{ locationType }}</span>
        </div>
        <div
          v-if="singlePlaceRating"
          class="rating"
        >
          <IconSvg iconIndex="icon-rating-star" class="star" />
          <span class="rating-number">{{ singlePlaceRating }}</span>
        </div>
      </div>
      <div class="item-addresses">
        <div
          v-for="item in pickups"
          :key="item.id"
          :id="`pickup-${item.id}`"
        >
          <div
            v-if="item.place_information_parsed"
            class="item-address"
          >
            {{ item.place_information_parsed.formatted_address }}
            <div
              v-if="item.place_information_parsed.rating > 0 && numberLocations > 1"
              class="rating"
            >
              <IconSvg iconIndex="icon-rating-star" class="star" />
              <span class="rating-number">{{ item.place_information_parsed.rating }}</span>
            </div>
          </div>
        </div>
        <div
          v-for="item in shippings"
          :key="item.id"
          :id="`pickup-${item.id}`"
          >
          <div
            v-if="item.place_information_parsed"
            class="item-address"
          >
            {{ item.place_information_parsed.formatted_address }}
          </div>
        </div>
        <div class="item-currencies">
          <div
            v-for="item in cryptoCurrencies"
            :key="item"
            class="item-currency"
          >
            <IconSvg :iconIndex="`icon-${item.toLowerCase()}`" />
          </div>
        </div>
      </div>
    </div>
  </button>
</template>
