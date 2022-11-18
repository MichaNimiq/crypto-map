import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

export const useApp = defineStore("app", () => {
  const listIsShown = ref(false);
  const toggleList = () => listIsShown.value = !listIsShown.value;
  const showList = () => listIsShown.value = true;

  const selectedEstablishmentId = ref<number>();

  const route = useRoute();
  watch(route, () => {
    if (route.name === "establishment_detail") {
      selectedEstablishmentId.value = Number(route.params.id);
    }
  });

  return {
    listIsShown,
    toggleList,
    showList,
    selectedEstablishmentId: selectedEstablishmentId,
  }
});
