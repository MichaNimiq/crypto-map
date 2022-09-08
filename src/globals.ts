import { ref } from "vue";

export const cryptoCurrencies = [
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

export const locationTypes = [
  {
    id: "electronics",
    name: "Computer & Electronics",
  },
  {
    id: "entertainment",
    name: "Entertainment",
  },
  {
    id: "food",
    name: "Food & Drinks",
  },
  {
    id: "restaurant",
    name: "Restaurant & Bar",
  },
  {
    id: "health",
    name: "Health & Beauty",
  },
  {
    id: "leisure",
    name: "Leisure Activities",
  },
];

export const filterVisible = ref<boolean>(false);
export const filterListVisible = ref<boolean>(false);
export const selectedId = ref<number>(-1);
