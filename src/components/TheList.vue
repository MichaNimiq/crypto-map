<script setup lang="ts">
import debug from "@/debug";
import { filterListVisible } from "@/globals";
import { watch, ref, onMounted } from "vue";
import merchant_map_client_instance from "@/merchant-map-client";
import ListItem from "@/components/elements/ListItem.vue";

const theList = ref<HTMLDivElement | null>(null);

watch(filterListVisible, () => {
  resizing();
});

window.addEventListener("resize", () => {
  resizing();
});

onMounted(() => {
  resizing();
});

function resizing() {
  if (!theList.value)
    return false;

  if (window.innerWidth <= 768){
    theList.value.removeAttribute("style");
    return false;
  }

  const listLeft = (window.innerWidth >= 1360);

  debug(filterListVisible.value);

  if (!filterListVisible.value) {
    const listWidthHeight = listLeft
      ? theList.value?.clientWidth
      : theList.value?.clientHeight;
    theList.value.style.marginLeft = listLeft ? `-${listWidthHeight}px` : "0px";
    theList.value.style.marginBottom = listLeft
      ? "0px"
      : `-${listWidthHeight}px`;
  } else {
    theList.value.removeAttribute("style");
  }
}
</script>

<template>
  <div
    id="the-list"
    ref="theList"
    :data-results="merchant_map_client_instance.results.value.data.length"
    :class="`${filterListVisible ? 'visible' : ''}`"
  >
    <div class="list-wrap">
      <div
        class="list-item-wrap"
        v-for="item in merchant_map_client_instance.results.value.data"
        :key="item.id"
      >
        <ListItem
          v-if="item.pickups.length > 0 || item.shippings.length > 0"
          :itemData="item"
        />
      </div>
    </div>
  </div>
</template>
