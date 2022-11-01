import { Configuration, LocationsApi, type CryptoCurrency as CryptoCurrencyApi, type SearchLocationsRequest, type SearchLocationsResponse, type CryptoLocation as CryptoLocationApi } from "@/api";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Location } from "./map";
import type { SelectOption } from "../components/elements/Select.vue"
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

const basePath: string = import.meta.env.VITE_URL_API_URL
const googleMapsKey: string = import.meta.env.VITE_GOOGLE_MAP_KEY

const mapApi = new LocationsApi(new Configuration({
  basePath
}))

export type CryptoCurrency = SelectOption
export type LocationCategory = SelectOption
export type IssueCategory = SelectOption

// TODO Model this from the API,not model it here!
const locationCategories = [
  { id: "1", name: "Cash" },
  { id: "2", name: "Cars & Bikes" },
] as LocationCategory[]

// TODO Model this from the API,not model it here!
const cryptoCurrencies = [
  { id: "nim", name: "Nimiq" },
  { id: "btc", name: "Bitcoin" },
  { id: "eth", name: "Ethereum" },
  { id: "dash", name: "Dash" },
  { id: "xlm", name: "Stella Lumens" },
  { id: "xrp", name: "Ripple" },
  { id: "ltc", name: "Litecoin" }
] as CryptoCurrency[]

// TODO Model this from the API,not model it here!
const issueCategories = [
  { id: "crypto-location-gone", name: "Place closed / does not exist" },
  { id: "missing-currency", name: "Currency missing" },
  { id: "missing-not-accepted", name: "Currency not accepted" },
  { id: "no-crypto", name: "Place doesn't accept crypto" },
  { id: "other", name: "Other" },
] as IssueCategory[]

export type CryptoLocation = {
  id: number;
  placeId: string;
  name: string;
  photoUrl: string;
  category: LocationCategory;
  type: string;
  // Maybe icon type won't be the same as type
  rating: number; // From 0 to 5
  address: string;
  gmapsUrl: string;
  geoLocation: {
    lng: number;
    lat: number;
  };
  currencies: CryptoCurrency[];
}
export const useApi = defineStore("api", () => {
  // Loaded cryptoLocations from the API
  const cryptoLocations = ref<CryptoLocation[]>([])

  const route = useRoute()
  const router = useRouter()

  function parsedQuery(key: 'categories' | 'currencies', src: SelectOption[]) {
    const items = route.query[key]
    if (!items) return []
    const ids = typeof items === 'string' ? [items] : items as string[]
    return (ids.map((id: string) => src.find((item) => item.id === id)).filter(Boolean) || []) as SelectOption[]
  }

  const selectedCurrencies = ref(parsedQuery('currencies', cryptoCurrencies))
  const selectedCategories = ref(parsedQuery('categories', locationCategories))

  watch([selectedCategories, selectedCurrencies], ([]) => {
    router.push({
      query: {
        categories: selectedCategories.value.map(c => c.id),
        currencies: selectedCurrencies.value.map(c => c.id),
      }
    })
  })

  // Converts crypto location model from the API to the model used in the app
  // The model in the API is built the following way:
  // 1. A business can have multiple locations in the world. Each location will be a separated item in the 'pickups' array.
  //    Each of this items is a unique location which its own store, place id, address...
  // 2. A businness can have also online presence. But this for now does not happen.

  // So the API returns an array of business, which each one of them has an array of locations. We need to flatten this array into a single array of locations.
  // This functions just does that.
  function parseLocations(locationApi: CryptoLocationApi): CryptoLocation[] {
    const { id, label: name, currencies: currenciesApi, pickups } = locationApi

    if (pickups.length === 0) return []

    const locations: CryptoLocation[] = pickups.map(({ geo_location, place_information, place_id: placeId }) => {
      const { photos, rating, formatted_address: address, url: gmapsUrl, types } = place_information
      // TODO Review placeholder
      const photoUrl = photos && photos.length > 0 ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photos[0].photo_reference}&key=${googleMapsKey}` : "/img/place-placeholder.jpg"

      const currencies = currenciesApi.reduce((acc, curr) => {
        const id = Object.keys(curr).find((key) => curr[key as keyof CryptoCurrencyApi] !== undefined) as keyof CryptoCurrencyApi | undefined
        if (id) {
          acc.push({ id, name: curr[id] as string })
        }
        return acc
      }, [] as CryptoLocation["currencies"])

      return {
        id,
        placeId,
        name,
        address,
        currencies,
        geoLocation: {
          lat: geo_location.coordinates[1],
          lng: geo_location.coordinates[0],
        },
        gmapsUrl,
        rating,
        photoUrl,
        // TODO Use the right category
        category: locationCategories[0],
        type: types?.[0].replace(/_/g, " ").toLowerCase() || "Miscellaneous",
      } as CryptoLocation
    })

    return locations
  }

  async function search({ northEast, southWest }: Location) {
    const boundingBoxStr = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`

    const body: SearchLocationsRequest = {
      filterBoundingBox: boundingBoxStr
    }

    console.log('🔍 Searching in the API: ', body)

    const response: SearchLocationsResponse = await mapApi.searchLocations(body).catch((e) => {
      return e;
    })

    if (response instanceof Error) {
      console.error(response);
      // alert('The api is not available'); // TODO Handle error
      return;
    }


    cryptoLocations.value = response.data
      .map(parseLocations)
      .reduce((acc, curr) => [...acc, ...curr], []) // flatten the array
  }

  async function getLocationById(locationId: string) {
    const rawLocation = await mapApi.getLocationById({ locationId }).catch((e) => {
      return e;
    })
    return parseLocations(rawLocation)?.[0] || undefined
  }

  return {
    search,
    cryptoLocations,
    categories: ref(locationCategories),
    cryptoCurrencies: ref(cryptoCurrencies),
    issueCategories: ref(issueCategories),
    selectedCurrencies,
    selectedCategories,
    getLocationById,
    mapApi
  }
})