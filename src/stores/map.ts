import { defineStore } from "pinia";
import { useApi } from "./api";

export type BoundingBox = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export type MapPosition = LatLng & { zoom: number }

export const useMap = defineStore({
  id: "map",
  state: () => ({
    boundingBox: {
      swLng: 0,
      swLat: 0,
      neLng: 0,
      neLat: 0,
    } as BoundingBox,
  }),
  getters: {
  },
  actions: {
    async setBoundingBox(boundingBox: BoundingBox) {
      this.boundingBox = boundingBox;
      await useApi().search(this.boundingBox);
    }
  },
});
