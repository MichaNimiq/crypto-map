import type { CryptoEstablishment as CryptoEstablishmentApi, CurrencyInner as Currency } from "@/api";
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useApi } from "./api";
import { useMap } from "./map";


export type BaseEstablishment = Pick<CryptoEstablishmentApi, "uuid" | "name" | "category"> & {
  geoLocation: CryptoEstablishmentApi["geo_location"];
  hasAllInfo: false;
  gmapsUrl: undefined;
  gmapsPlaceId: undefined;
  gmapsType: undefined;
  photoUrl: undefined;
  currencies: Currency[];
  rating: undefined;
  address: undefined;
}

export type Establishment = Pick<BaseEstablishment, "uuid" | "name" | "category" | "geoLocation" | "currencies"> & {
  hasAllInfo: true;
  gmapsUrl: CryptoEstablishmentApi["gmaps_url"];
  gmapsPlaceId: CryptoEstablishmentApi["gmaps_place_id"];
  geoLocation: CryptoEstablishmentApi["geo_location"];
  gmapsType: CryptoEstablishmentApi["gmaps_type"];
  photoUrl?: string;
  rating: CryptoEstablishmentApi["rating"];
  address: CryptoEstablishmentApi["address"];
}

export const useEstablishments = defineStore("establishments", () => {
  /**
  * Establishments holds the list of establishments
  * To save memory, we use a Map to store the establishments and at the beginning is an empty Map
  * Once the user starts to navigate the map (moving and dragin the map), we start to fetch the establishments
  * but only "basic" info we need to display in the map: name, category(for the icon), id(for the URL if user clicks) and geoLocation(for the marker)
  * Lets recreate the process:
  * 1, User opens the map. The establishments is empty like { }
  * 2. Once map is loaded, we fetch the establishments in the current viewport (given the bounding box).
  * 3. We store the establishments in the map, but only the basic info. In this case, we store 2 establishments like this:
  *      Map<uuid, { name, category, id, geoLocation }> => 
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *         }
  * 4. User moves the map. We fetch the establishments in the new viewport (given the bounding box). A new establishments is fetched.
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *           "55555": { name: "Coffee tico", category: 'rest', id: 55555, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *         }
  * 5. User opens the list of establishments. And in the viewport in the list only 2 items fits the list, so we need to fetch the rest of info
  *    given the id. Once the info is loaded, we update the establishments map with the new info.
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: true, gmapsUrl, photoUrl, currencies, rating...} },
  *           "55555": { name: "Coffee tico", category: 'rest', id: 55555, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: true, gmapsUrl, photoUrl, currencies, rating... } },
  *         }
  * 6. Once the info is loaded, we no longer will fetch the info for the establishment, because we already have it.
  * 
  * Then we computed the establishments that are currently in the viewport (given the bounding box) and we display them 
  * in the map.
  */
  const establishments = ref(new Map<string, BaseEstablishment | Establishment>([]))

  const apiStore = useApi()
  const { selectedCurrencies, selectedCategories } = storeToRefs(apiStore)

  const mapStore = useMap()
  const { boundingBox, surroundingBoundingBox } = storeToRefs(mapStore)


  function filterByCurrencies(establishment: BaseEstablishment | Establishment) {
    if (!selectedCurrencies || selectedCurrencies.value.length === 0) return true
    return establishment.currencies.some(c => selectedCurrencies.value.includes(c.symbol))
  }

  function filterByCategories(establishment: BaseEstablishment | Establishment) {
    if (!selectedCategories || selectedCategories.value.length === 0) return true
    return selectedCategories?.value.includes(establishment.category)
  }

  const establishmentsInView = computed(() => {
    const { northEast, southWest } = boundingBox.value
    const establishmentsInView: (Establishment | BaseEstablishment)[] = []
    for (const [, establishment] of establishments.value) {
      // Check if the establishment is in the bounding box
      const { lat, lng } = establishment.geoLocation
      const insideBoundingBox = lat <= northEast.lat && lat >= southWest.lat && lng <= northEast.lng && lng >= southWest.lng

      // Check if the establishment should be hidden by the filters
      const filteredByCurrencies = filterByCategories(establishment)
      const filteredByCategories = filterByCurrencies(establishment)

      if (insideBoundingBox && filteredByCurrencies && filteredByCategories) {
        establishmentsInView.push(establishment)
      }
    }
    return establishmentsInView
  })

  // ┌────────────────────────────────────────────────────────────────────────┐
  // │                                                                        │
  // │                                                                        │
  // │                       ┌───────────────────────┐                        │
  // │                       │                       │◄───────────────────────┼────── bounding box / user screen
  // │                       │  establishmentInView  │                        │
  // │                       │                       ├────────────────────────┼─────► same distance as viewport width
  // │                       └───────────────────────┘                        │
  // │                                                                        │
  // │                                                                        │
  // │                      nearEstablishmentsNotInView                       │─────► surroundingBoundingBox is `scaleFactor` times bigger than boundingBox (see mapStore)
  // │                                                                        │
  // └─────────────────────────────────────────────────-──────────────────────┘

  // this will be used to show items in the list that are not in the viewport, but user requested to see
  const nearEstablishmentsNotInView = computed(() => {
    const nearEstablishmentsNotInView: (Establishment | BaseEstablishment)[] = []
    const { northEast, southWest } = surroundingBoundingBox.value
    for (const [, establishment] of establishments.value) {
      if (establishmentsInView.value.includes(establishment)) continue

      const { lat, lng } = establishment.geoLocation
      const insideBoundingBox = lat <= northEast.lat && lat >= southWest.lat && lng <= northEast.lng && lng >= southWest.lng

      // Check if the establishment should be hidden by the filters
      const filteredByCurrencies = filterByCategories(establishment)
      const filteredByCategories = filterByCurrencies(establishment)

      if (insideBoundingBox && filteredByCurrencies && filteredByCategories) {
        nearEstablishmentsNotInView.push(establishment)
      }
    }
    return nearEstablishmentsNotInView
  })

  const shouldShowNearby = ref(false)

  function showNearby() {
    shouldShowNearby.value = true
  }

  function hideNearby() {
    shouldShowNearby.value = false
  }

  return {
    surroundingBoundingBox,
    establishments,
    establishmentsInView,
    nearEstablishmentsNotInView,
    shouldShowNearby,
    showNearby,
    hideNearby,
  }
})