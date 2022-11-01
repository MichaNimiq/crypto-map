import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

export const useApp = defineStore("app", () => {
  const showList = ref(false);
  const toggleList = () => showList.value = !showList.value;

  const selectedLocationId = ref<string>();

  const route = useRoute();
  watch(route, () => selectedLocationId.value = route.name === 'location_detail' ? String(route.params.id) : undefined);



  return {
    showList,
    toggleList,
    selectedLocationId,
  }
});
