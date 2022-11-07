import { Configuration, LocationsApi, type CategoriesIssuesInner as CategoriesIssuesApi, type CryptoLocation as CryptoLocationApi, type SearchLocationsRequest } from "@/api";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { SelectOption } from "../components/elements/Select.vue";
import type { BoundingBox } from "./map";
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

export const mapApi = new LocationsApi(new Configuration({
  basePath
}))

export type CryptoCurrency = SelectOption
export type LocationCategory = SelectOption

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
  // Data from API
  const cryptoLocations = ref<CryptoLocation[]>([])
  const categoriesIssue = ref<SelectOption[]>([])

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
  function parseLocation(locationApi: CryptoLocationApi): CryptoLocation {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${locationApi.photo_reference}&key=${googleMapsKey}`
    const currencies = locationApi.currencies.map((currencySymbol) => {
      const currency = cryptoCurrencies.find((currency) => currency.id === currencySymbol)
      if (currency) {
        return {
          id: currency.id,
          name: currency.name,
        }
      }
    }).filter(Boolean) as CryptoCurrency[]

    return {
      id: locationApi.id,
      placeId: locationApi.place_id,
      name: locationApi.name,
      photoUrl,
      category: locationCategories[0], // TODO
      type: locationApi.type,
      rating: locationApi.rating,
      address: locationApi.address,
      currencies,
      gmapsUrl: locationApi.gmaps_url,
      geoLocation: { ...locationApi.geo_location }
    }
  }

  async function search({ northEast, southWest }: BoundingBox) {
    const boundingBoxStr = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`

    const body: SearchLocationsRequest = {
      filterBoundingBox: boundingBoxStr
    }

    console.log('🔍 Searching in the API: ', body)

    const response: CryptoLocationApi[] = await mapApi.searchLocations(body).catch((e) => e)

    if (response instanceof Error) {
      console.error(response);
      // alert('The api is not available'); // TODO Handle error
      return;
    }

    cryptoLocations.value = response.map(parseLocation)
  }

  async function getLocationById(locationId: string) {
    const rawLocation = await mapApi.getLocationById({ locationId }).catch((e) => e)
    return parseLocation(rawLocation) || undefined
  }

  async function setIssueCategories() {
    console.log('🔍 Getting categories from the API')
    const res: CategoriesIssuesApi[] = await mapApi.getIssueCategories().catch((e) => e)
    console.log('🔍 Got categories from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }
    console.log({ res })
    categoriesIssue.value = res
  }

  return {
    search,
    cryptoLocations,
    categories: ref(locationCategories),
    cryptoCurrencies: ref(cryptoCurrencies),
    categoriesIssue,
    setIssueCategories,
    selectedCurrencies,
    selectedCategories,
    getLocationById,
  }
})