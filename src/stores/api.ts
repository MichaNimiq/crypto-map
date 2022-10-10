import { Configuration, CryptoLocationFromJSON, LocationsApi, type CryptoCurrency as CryptoCurrencyApi, type CryptoLocation as ApiCryptoLocation, type GeoLocation, type SearchLocationsRequest, type SearchLocationsResponse } from "@/api";
import { defineStore } from "pinia";
import { useApp } from "./app";
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

const partnerApi = new LocationsApi(new Configuration({
  basePath
}))

type CatalogItem = {
  id: string;
  name: string;
}

export type CryptoCurrency = CatalogItem
export type LocationCategory = CatalogItem
export type IssueCategory = CatalogItem

// TODO Model this from the API,not model it here!
const categories = [
  { id: "CASH", name: "Cash" },
  { id: "CARS_BIKES", name: "Cars & Bikes" },
] as LocationCategory[]

// TODO Model this from the API,not model it here!
const cryptoCurrencies = [
  { id: "NIM", name: "Nimiq" },
  { id: "BTC", name: "Bitcoin" },
  { id: "ETH", name: "Ethereum" },
  { id: "DASH", name: "Dash" },
  { id: "XLM", name: "Stella Lumens" },
  { id: "XRP", name: "Ripple" },
  { id: "LTC", name: "Litecoin" }
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
  name: string;
  photoUrl: string;
  type: LocationCategory;
  // Maybe icon type won't be the same as type
  rating: number; // From 0 to 5
  address: string;
  gmapsUrl: string;
  geo_location: {
    lng: number;
    lat: number;
  };
  currencies: CryptoCurrency[];
}

export const useApi = defineStore({
  id: "api",
  state: () => ({
    previousResultsLength: 0,
    current_page: 1,
    locations: [] as CryptoLocation[],
    first_page_url: "",
    from: 1,
    last_page: 1,
    last_page_url: "",
    links: [],
    next_page_url: null,
    path: "",
    per_page: 20,
    prev_page_url: null,
    to: 20,
    total: 0,

    categories,
    cryptoCurrencies,
    issueCategories,

    selectedFilters: {
      cryptoCurrencies: [] as CryptoCurrency[],
      categories: [] as LocationCategory[],
    }
  }),
  getters: {
  },
  actions: {
    async search(boundingBox: BoundingBox) {

      const boundingBoxStr = `${boundingBox.swLng},${boundingBox.swLat},${boundingBox.neLng},${boundingBox.neLat}`

      const body: SearchLocationsRequest = {
        filterBoundingBox: boundingBoxStr
      }

      console.log('🔍 Searching in the API: ', body)

      const response: SearchLocationsResponse = await partnerApi.searchLocations(body).catch((e) => {
        return e;
      })

      if (response instanceof Error) {
        console.error(response);
        // alert('The api is not available'); // TODO Handle error
        return;
      }


      this.locations = response.data
        .filter(({ pickups }) => pickups.length > 0)
        .map(({ id, label: name, currencies: currenciesApi, pickups }) =>
          pickups.map(({ geo_location, place_information }) => {
            const { photos, rating, formatted_address: address, url: gmapsUrl, types } = place_information
            // TODO Review placeholder
            const photoUrl = photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photos[0].photo_reference}&key=${googleMapsKey}` : "/img/place-placeholder.jpg"

            const currencies = currenciesApi.reduce((acc, curr) => {
              const id = Object.keys(curr).find((key) => curr[key as keyof CryptoCurrencyApi] !== undefined) as keyof CryptoCurrencyApi | undefined
              if (id) {
                acc.push({ id, name: curr[id] as string })
              }
              return acc
            }, [] as CryptoLocation["currencies"])

            return {
              id,
              name,
              address,
              currencies,
              geo_location: {
                lat: geo_location.coordinates[1],
                lng: geo_location.coordinates[0],
              },
              gmapsUrl,
              rating,
              photoUrl,
              // TODO Use the right category
              type: categories[0],
            } as CryptoLocation
          })
        ).reduce((acc, curr) => [...acc, ...curr], []);
      const nLocations = this.locations.length;

      const { showLocationsList, hideLocationsList } = useApp()

      if (nLocations === 0) {
        hideLocationsList()
      } else if (this.previousResultsLength === 0) {
        showLocationsList()
      }

      this.previousResultsLength = nLocations;

      return true;
    }
  }
});
