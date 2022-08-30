import debug from "@/debug";
import axios from "axios";
import type { merchant_map_result, boundingBox } from "@/interfaces";
import googleMapsHelperInstance from "@/google-maps-helper";
import { ref } from "vue";

class merchant_map_client {
  searchString: string | null = null;

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
    try {
      axios.get(import.meta.env.VITE_URL_BACKEND).then((resp) => {
        this.results.value = resp.data;
      });
    } catch (error) {
      debug(["Error while fetching results", error]);
    }
  }

  getResults(
    limit = 0,
    boundingBox: boundingBox | null = googleMapsHelperInstance.boundingBox,
    searchTerm: string | null = this.searchString
  ) {
    try {
      const queryParams: {
        "filter[bounding_box]"?: string;
        "filter[limit]"?: number;
        "filter[label]"?: string;
      } = {};

      if (boundingBox !== null)
        queryParams[
          "filter[bounding_box]"
        ] = `${boundingBox.swLng},${boundingBox.swLat},${boundingBox.neLng},${boundingBox.neLat}`;

      if (searchTerm !== null) queryParams["filter[label]"] = `${searchTerm}`;

      queryParams["filter[limit]"] = limit;

      debug(JSON.stringify(queryParams));

      axios
        .get(`${import.meta.env.VITE_URL_BACKEND}`, {
          params: queryParams,
        })
        .then((resp) => {
          this.results.value = resp.data;

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
