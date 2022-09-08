import debug from "@/debug";
import { ref } from "vue";
import axios from "axios";
import type { merchant_map_result, boundingBox, selectEntry } from "@/interfaces";
import googleMapsHelperInstance from "@/google-maps-helper";
import { filterListVisible } from "@/globals";

class merchant_map_client {
  searchString: string = '';

  cryptoCurrencies: selectEntry[] = [];
  locationTypes: string[] = [];

  previousResultsLength: number = 0;

  results = ref<merchant_map_result>({
    current_page: 1,
    data: [],
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
  });

  constructor() {
    // nothing for now
  }

  getResults(
    limit = 0,
    boundingBox: boundingBox | null = googleMapsHelperInstance.boundingBox,
    searchTerm: string = this.searchString
  ) {
    try {
      const queryParams: {
        "filter[bounding_box]"?: string;
        "filter[limit]"?: number;
        "filter[label]"?: string;

        // not implemented API wise, yet
        // "filter[currency]"?: string;
        // "filter[location]"?: string;
      } = {};

      if (searchTerm !== null) queryParams["filter[label]"] = `${searchTerm}`;

      // only respect the search area if no term is set in the search input
      if (searchTerm.length == 0 && boundingBox !== null)
        queryParams[
          "filter[bounding_box]"
        ] = `${boundingBox.swLng},${boundingBox.swLat},${boundingBox.neLng},${boundingBox.neLat}`;

      queryParams["filter[limit]"] = limit;

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

      debug(JSON.stringify(queryParams));

      axios
        .get(`${import.meta.env.VITE_URL_BACKEND}`, {
          params: queryParams,
        })
        .then((resp) => {
          this.results.value = resp.data;

          debug(this.results.value);

          if (
            this.results.value.data.length == 0
          )
            filterListVisible.value = false;
          else if (
            this.results.value.data.length > 0 &&
            this.previousResultsLength == 0
          )
            filterListVisible.value = true;

          this.previousResultsLength = this.results.value.data.length;

          googleMapsHelperInstance.renderMarkers(this.results.value);

          return true;
        });
    } catch (error) {
      debug(["getResults: Error while fetching results", error]);
    }

    return false;
  }
}

const merchant_map_client_instance: merchant_map_client =
  new merchant_map_client();

export default merchant_map_client_instance;
