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

export function getLocationTypeString( locationType: string = "") {
  if ( locationType.length == 0 )
    return false;

  if (locationType.indexOf("selectEntries.type-") == -1)
    if (locationType.length > 0)
      return locationType;

  return false;
}

export const issueTypes: string[] = [
  "desc",
  "currency",
  "location",
  "gone",
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
