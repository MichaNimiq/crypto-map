import { defineStore } from "pinia";
import googleMapsHelperInstance from "@/google-maps-helper";
import { useApp } from "./app";


/*
NOT IMPLEMENTED API-WISE
so the to come filter string is currently unknown
this.cryptoCurrencies and this.locationTypes should
already be filled by the select boxes, though
 
for (const key in this.cryptoCurrencies) {
  const currency = this.cryptoCurrencies[key];
  queryParams["filter[currency]"] += `${parseInt(key) > 0 ? ',' : ''}${currency.id}`
}
 
for (const key in this.locationTypes) {
  const location = this.locationTypes[key];
  queryParams["filter[location]"] += `${parseInt(key) > 0 ? ',' : ''}${location}`
}
*/

const API_URL = import.meta.env.VITE_URL_BACKEND

export const useApi = defineStore({
  id: "api",
  state: () => ({
    previousResultsLength: 0,
    current_page: 1,
    locations: [] as Daum[],
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
  }),
  getters: {
  },
  actions: {
    async search(limit = 0) {
      console.trace();
      const url = new URL(API_URL);

      const { boundingBox } = googleMapsHelperInstance
      const boundingBoxStr = `${boundingBox.swLng},${boundingBox.swLat},${boundingBox.neLng},${boundingBox.neLat}`

      url.searchParams.append("filter[limit]", limit.toString());
      url.searchParams.append("filter[bounding_box]", boundingBoxStr);

      let response

      try {
        response = await fetch(url);
      } catch (e) {
        return false/** Do nothing */
      }

      // TODO Improve error
      if (!response) {
        throw new Error('Network response was not ok.');
      }
      const json = (await response.json()) as Root;

      this.locations = json.data;
      const nLocations = this.locations.length;

      const { showLocationsList, hideLocationsList } = useApp()

      if (nLocations === 0) {
        hideLocationsList()
      } else if (this.previousResultsLength === 0) {
        showLocationsList()
      }
      this.previousResultsLength = nLocations;

      googleMapsHelperInstance.renderMarkers(json as any);

      return true;
    }
  }
});



// TODO Improve typing with openapi
export interface Root {
  current_page: number
  data: Daum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface Daum {
  id: number
  label: string
  description: any
  website: any
  email: any
  phone: any
  zip: string
  city: string
  country: string
  digital_goods: boolean
  created_at: string
  updated_at: string
  address_line_1: string
  address_line_2: string
  address_line_3: string
  accepts: string[]
  pickups: Pickup[]
  shippings: any[]
}

export interface Pickup {
  id: number
  shop_id: number
  geo_location: GeoLocation
  created_at: string
  updated_at: string
  place_id: string
  label: any
  place_information: string
}

export interface GeoLocation {
  type: string
  coordinates: number[]
}

export interface Link {
  url?: string
  label: string
  active: boolean
}
