import { ref } from "vue";
import type { selectEntry } from "./interfaces";

export const cryptoCurrencies: string[] = [
  "BTC",
  "NIM",
  "LTC",
  "DASH",
  "XLM",
  "ETH",
  "XRP",
];

export const locationTypes: string[] = [
  "electronics",
  "entertainment",
  "food",
  "restaurant",
  "health",
  "leisure",
];

export const issueTypes: string[] = [
  "issueDesc",
  "issueCurrency",
  "issueLocation",
  "issueGone",
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

export const addLocationVisible = ref<boolean>(false);
export const reportIssueVisible = ref<boolean>(false);
export const filterVisible = ref<boolean>(false);
export const filterListVisible = ref<boolean>(false);
export const selectedId = ref<number>(-1);
