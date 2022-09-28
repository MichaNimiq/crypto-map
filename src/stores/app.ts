import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Category, type CryptoInformation } from "./api";

export const useApp = defineStore("app", () => {
  const locationListVisible = ref(false);
  const toggleLocationList = () => locationListVisible.value = !locationListVisible.value;
  const showLocationsList = () => locationListVisible.value = true;
  const hideLocationsList = () => locationListVisible.value = false;

  const selectedLocation = ref<number>();

  const route = useRoute();
  watch(route, () => selectedLocation.value = route.name === 'location_detail' ? Number(route.params.id) : undefined);

  const availableFilters = ref({
    cryptoCurrencies: [
      { short: "NIM", name: "Nimiq" },
      { short: "BTC", name: "Bitcoin" },
      { short: "ETH", name: "Ethereum" },
      { short: "DASH", name: "Dash" },
      { short: "XLM", name: "Stella Lumens" },
      { short: "XRP", name: "Ripple" },
      { short: "LTC", name: "Litecoin" },
    ] as CryptoInformation[],
    // @ts-ignore
    categories: Object.values(Category) as string[],
  })

  const selectedFilters = ref({
    cryptoCurrencies: [] as typeof availableFilters["value"]["cryptoCurrencies"],
    categories: [] as typeof availableFilters["value"]["categories"],
  })

  return {
    locationListVisible,
    toggleLocationList,
    showLocationsList,
    hideLocationsList,
    selectedLocation,
    availableFilters,
    selectedFilters
  }
});
