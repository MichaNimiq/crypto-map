import { defineStore } from "pinia";

export const useApp = defineStore({
  id: "app",
  state: () => ({
    locationListVisible: false,
  }),
  getters: {
  },
  actions: {
    toggleLocationList() {
      this.locationListVisible = !this.locationListVisible;
    },
    showLocationsList() {
      this.locationListVisible = true;
    },
    hideLocationsList() {
      this.locationListVisible = false;
    },
  }
});
