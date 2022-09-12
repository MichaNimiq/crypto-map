<script setup lang="ts">
import debug from "@/debug";
import { filterListVisible, filterVisible } from "@/globals";
import { watch, ref, reactive, onMounted } from "vue";
import merchant_map_client_instance from "@/merchant-map-client";
import ListItem from "@/components/elements/ListItem.vue";

const theList = ref<HTMLDivElement | null>(null);
const theListHandle = ref<HTMLDivElement | null>(null);
const scrollWrap = ref<HTMLDivElement | null>(null);
let theMap: HTMLDivElement | null = null;

let dragMobileHandle = reactive<boolean>(false);

watch(filterListVisible, () => {
  resizing();
});

onMounted(() => {
  window.addEventListener("resize", () => {
    resizing();
  });

  window.addEventListener('dragover', (e: Event) => {
    if (dragMobileHandle) {
      console.log(`${window.innerHeight - e.clientY - 30}px`);

      const calculatedHeight = window.innerHeight - e.clientY - 30;

      theList.value.style.transition = 'none';
      theList.value.style.minHeight = `${window.innerHeight - e.clientY - 30}px`
      theList.value.style.height = `${window.innerHeight - e.clientY - 30}px`

      if (calculatedHeight / window.innerHeight > 0.3) {
        filterListVisible.value = true;
      } else {
        filterListVisible.value = false;
      }
    }
  });

  theListHandle.value?.addEventListener('dragstart', () => {
    console.log('dragstart')
    dragMobileHandle = true;
  });

  theListHandle.value?.addEventListener('dragend', (e) => {
    console.log('dragend')
    dragMobileHandle = false;
    theList.value?.removeAttribute('style');
    resizing();
  });

  if (window.innerWidth <= 768){
    filterListVisible.value = false;
  }

  resizing();
});

function resizing() {
  if (!theList.value)
    return false;

  if (window.innerWidth <= 768){
    theList.value.removeAttribute("style");
  }

  const listLeft = (window.innerWidth >= 1360);

  if (!filterListVisible.value) {
    if (window.innerWidth > 768){
      const listWidthHeight = listLeft
        ? theList.value?.clientWidth
        : theList.value?.clientHeight;
      theList.value.style.marginLeft = listLeft ? `-${listWidthHeight}px` : "0px";
      theList.value.style.marginBottom = listLeft
        ? "0px"
        : `-${listWidthHeight}px`;
    }
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
    <div
      class="mobile-handle"
      ref="theListHandle"
      draggable="true"
    >
      <div class="bar"></div>
    </div>
    <div class="scroll-wrap" ref="scrollWrap">
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
  </div>
</template>
