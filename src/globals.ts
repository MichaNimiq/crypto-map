import { ref } from "vue";
import type { selectEntry } from "./interfaces";

export const cryptoCurrencies: selectEntry[] = [
  {
    id: "BTC",
    name: "Bitcoin",
  },
  {
    id: "NIM",
    name: "nimiq",
  },
  {
    id: "LTC",
    name: "Litecoin",
  },
  {
    id: "DASH",
    name: "Dash",
  },
  {
    id: "XLM",
    name: "Stella Lumens",
  },
  {
    id: "ETH",
    name: "Ethereum",
  },
  {
    id: "XRP",
    name: "Ripple",
  },
];

export const locationTypes: selectEntry[] = [
  {
    id: "electronics",
    name: '',
  },
  {
    id: "entertainment",
    name: '',
  },
  {
    id: "food",
    name: '',
  },
  {
    id: "restaurant",
    name: '',
  },
  {
    id: "health",
    name: '',
  },
  {
    id: "leisure",
    name: '',
  },
];

export function getLocationTypeNarrowed( locationType: string = '' ) {
  if (locationType == '')
    return false;

  switch (locationType) {
    case 'locality':
      return ''
      break;
  
    default:
      break;
  }
}

export const addLocationVisible = ref<boolean>(true);
export const reportIssueVisible = ref<boolean>(true);
export const filterVisible = ref<boolean>(false);
export const filterListVisible = ref<boolean>(false);
export const selectedId = ref<number>(-1);
