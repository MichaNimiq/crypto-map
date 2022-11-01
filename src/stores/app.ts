import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

export const useApp = defineStore("app", () => {
  const showList = ref(false);
  const toggleList = () => showList.value = !showList.value;

  const selectedLocationId = ref<string>();

  const route = useRoute();
  watch(route, () => {
    if(route.name === "location_detail") {
      selectedLocationId.value = String(route.params.place_id)
    }
  });

  return {
    showList,
    toggleList,
    selectedLocationId,
  }
});
