import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useApi, type LocationCategory, type CryptoCurrency } from "@/stores/api";

export const useApp = defineStore("app", () => {
  const locationListVisible = ref(false);
  const toggleLocationList = () => locationListVisible.value = !locationListVisible.value;
  const showLocationsList = () => locationListVisible.value = true;
  const hideLocationsList = () => locationListVisible.value = false;

  const selectedLocation = ref<number>();

  const route = useRoute();
  watch(route, () => selectedLocation.value = route.name === 'location_detail' ? Number(route.params.id) : undefined);

  return {
    locationListVisible,
    toggleLocationList,
    showLocationsList,
    hideLocationsList,
    selectedLocation,
  }
});
