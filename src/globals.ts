import { ref } from "vue";

export const cryptoCurrencies = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Nimiq", symbol: "NIM" },
  { name: "Litcoin", symbol: "NIM" },
  { name: "Dash", symbol: "DASH" },
  { name: "Stellar Lumens", symbol: "XLM" },
  { name: "Etherium", symbol: "ETH" },
  { name: "Ripple", symbol: "XRP" },
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

// TODO Move this to stores
export const addLocationVisible = ref<boolean>(false);
export const reportIssueVisible = ref<boolean>(false);
export const filterVisible = ref<boolean>(false);
export const selectedId = ref<number>(-1);
