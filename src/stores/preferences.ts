import { defineStore } from "pinia";

// todo for later persistence if wanted
// not implemented, yet

export const nimiqMapPreferences = defineStore({
  id: "preferences",
  state: () => ({
    position: {
      lat: 0,
      lang: 0,
    },
    zoom: "3",
    filter: {
      currencies: [],
      locations: [],
    },
  }),
});