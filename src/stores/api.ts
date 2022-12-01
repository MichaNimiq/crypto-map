import { Configuration, EstablishmentsApi, type CryptoEstablishment as CryptoEstablishmentApi, type CryptoEstablishmentBaseInner as CryptoEstablishmentBaseApi, type CurrencyInner as Currency, type PostCandidateRequest as CandidateRequest, type PostEstablishmentIssueRequest as EstablishmentIssueRequest, type SearchEstablishmentsRequest } from "@/api";
import { defineStore, storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMap } from "./map";

const basePath: string = import.meta.env.VITE_URL_API_URL
const googleMapsKey: string = import.meta.env.VITE_GOOGLE_MAP_KEY

export const establishmentsApi = new EstablishmentsApi(new Configuration({
  basePath
}))


// FIXME This should be removed 
interface Category {
  id: string;
  label: string;
}

// FIXME This should be removed 
interface CategoriesIssue {
  id: string;
  label: string;
}

export type BaseEstablishment = Pick<CryptoEstablishmentApi, "id" | "name" | "category"> & {
  geoLocation: CryptoEstablishmentApi["geo_location"];
  hasAllInfo: false;
  gmapsUrl: undefined;
  gmapsPlaceId: undefined;
  gmapsType: undefined;
  photoUrl: undefined;
  currencies: Currency[];
  rating: undefined;
  address: undefined;
}

export type Establishment = Pick<BaseEstablishment, "id" | "name" | "category" | "geoLocation" | "currencies"> & {
  hasAllInfo: true;
  gmapsUrl: CryptoEstablishmentApi["gmaps_url"];
  gmapsPlaceId: CryptoEstablishmentApi["gmaps_place_id"];
  geoLocation: CryptoEstablishmentApi["geo_location"];
  gmapsType: CryptoEstablishmentApi["gmaps_type"];
  photoUrl: string;
  rating: CryptoEstablishmentApi["rating"];
  address: CryptoEstablishmentApi["address"];
}

export const useApi = defineStore("api", () => {
  /* 
  * Establishments holds the list of establishments
  * To save memory, we use a Map to store the establishments and at the beginning is an empty Map
  * Once the user starts to navigate the map (moving and dragin the map), we start to fetch the establishments
  * but only "basic" info we need to display in the map: name, category(for the icon), id(for the URL if user clicks) and geoLocation(for the marker)
  * Lets recreate the process:
  * 1, User opens the map. The establishments is empty like { }
  * 2. Once map is loaded, we fetch the establishments in the current viewport (given the bounding box).
  * 3. We store the establishments in the map, but only the basic info. In this case, we store 2 establishments like this:
  *      Map<id, { name, category, id, geoLocation }> => 
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *         }
  * 4. User moves the map. We fetch the establishments in the new viewport (given the bounding box). A new establishments is fetched.
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *           "55555": { name: "Coffee tico", category: 'rest', id: 55555, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: false } },
  *         }
  * 5. User opens the list of establishments. And in the viewport in the list only 2 items fits the list, so we need to fetch the rest of info
  *    given the id. Once the info is loaded, we update the establishments map with the new info.
  *         {
  *           "12345": { name: "Max's shoes", category: 'shop', id: 12345, geoLocation: { lat: 10, lng: 20 }, hasAllInfo: false } },
  *           "98765": { name: "Market shop", category: 'shop', id: 98765, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: true, gmapsUrl, photoUrl, currencies, rating...} },
  *           "55555": { name: "Coffee tico", category: 'rest', id: 55555, geoLocation: { lat: 30, lng: 15 }, hasAllInfo: true, gmapsUrl, photoUrl, currencies, rating... } },
  *         }
  * 6. Once the info is loaded, we no longer will fetch the info for the establishment, because we already have it.
  */
  const establishments = ref(new Map<number, BaseEstablishment | Establishment>([]))

  // Items that are loaded only once at the beginning
  const categoriesIssue = ref<CategoriesIssue[]>([])
  const categories = ref<Category[]>([])
  const currencies = ref<Currency[]>([])

  const route = useRoute()
  const router = useRouter()

  // Filters
  const selectedCurrencies = ref(pathParamToStringList('currencies'))
  const selectedCategories = ref(pathParamToStringList('categories'))

  function pathParamToStringList(param: 'currencies' | 'categories') {
    const values = route.query[param] as string
    if (!values) return []
    if (typeof values === 'string') return [values]
    return values
  }

  const mapStore = useMap()
  const { boundingBox } = storeToRefs(mapStore)

  const establishmentsInView = computed(() => {
    const { northEast, southWest } = boundingBox.value
    const establishmentsInView = new Map<number, BaseEstablishment | Establishment>([])
    for (const [id, establishment] of establishments.value) {
      // Check if the establishment is in the bounding box
      const { lat, lng } = establishment.geoLocation
      const insideBoundingBox = lat <= northEast.lat && lat >= southWest.lat && lng <= northEast.lng && lng >= southWest.lng

      // Check if the establishment should be hidden by the filters
      const filteredByCurrencies = filterByCategories(establishment, selectedCurrencies.value)
      const filteredByCategories = filterByCurrencies(establishment, selectedCategories.value)

      if (insideBoundingBox && filteredByCurrencies && filteredByCategories) {
        establishmentsInView.set(id, establishment)
      }
    }
    return establishmentsInView
  })

  function filterByCurrencies(establishment: BaseEstablishment | Establishment, selectedCurrencies: string[]) {
    if (selectedCurrencies.length === 0) return true
    return establishment.currencies.some(c => selectedCurrencies.includes(c.symbol))
  }

  function filterByCategories(establishment: BaseEstablishment | Establishment, selectedCategories: string[]) {
    if (selectedCategories.length === 0) return true
    return selectedCategories.includes(establishment.category)
  }

  // Converts crypto location model from the API to the model used in the app
  function parseBaseEstablishment({ id, name, category, geo_location: geoLocation, currencies: establishmentCurrencySymbols }: CryptoEstablishmentBaseApi): BaseEstablishment {
    const establishmentCurrencies = currencies.value.filter(c => establishmentCurrencySymbols.includes(c.symbol))
    const parsedEstablishment: BaseEstablishment = {
      id, name, category, geoLocation, hasAllInfo: false,
      address: undefined, gmapsPlaceId: undefined, gmapsType: undefined, gmapsUrl: undefined, photoUrl: undefined, rating: undefined,
      currencies: establishmentCurrencies,
    }
    return parsedEstablishment
  }

  function parseEstablishment({
    id, address, category, currencies: establishmentCurrencySymbols, gmaps_place_id, gmaps_type, gmaps_url, geo_location, name, photo_reference, rating
  }: CryptoEstablishmentApi): Establishment {
    const photoUrl = photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photo_reference}&key=${googleMapsKey}`
      : "https://via.placeholder.com/540x540?text=No+photo+available" // TODO use a better placeholder
    const establishmentCurrencies = currencies.value.filter(c => establishmentCurrencySymbols.includes(c.symbol))

    const parsedEstablishment: Establishment = {
      hasAllInfo: true,
      address: address,
      category: category,
      currencies: establishmentCurrencies,
      gmapsPlaceId: gmaps_place_id,
      gmapsType: capitalize(gmaps_type.replace(/_/g, ' ')),
      gmapsUrl: gmaps_url,
      geoLocation: geo_location,
      id: id,
      name: name,
      photoUrl,
      rating: rating,
    }
    return parsedEstablishment
  }

  async function search() {
    const { northEast, southWest } = boundingBox.value
    const boundingBoxStr = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`

    const body: SearchEstablishmentsRequest = {
      filterBoundingBox: boundingBoxStr,
      filterEstablishmentCategoryLabel: selectedCategories.value || undefined,
      filterCurrency: selectedCurrencies.value || undefined,
    }

    console.log('🔍 Searching in the API: ', body)

    const response: CryptoEstablishmentBaseApi[] = await establishmentsApi.searchEstablishments(body).catch((e) => e)

    if (response instanceof Error) {
      console.error(response);
      // alert('The api is not available'); // TODO Handle error
      return;
    }

    response
      .map(parseBaseEstablishment)
      .sort((a, b) => b.geoLocation.lat - a.geoLocation.lat)
      .filter((e) => !establishments.value.has(e.id)) // ignore already loaded establishments
      .forEach((establishment) => establishments.value.set(establishment.id, establishment))
  }

  async function getEstablishmentById(establishmentId: number) {
    const rawEstablishment = await establishmentsApi.getEstablishmentById({ establishmentId: String(establishmentId) }).catch((e) => e)
    const establishment = parseEstablishment(rawEstablishment) || undefined
    console.log(`🔍 Got establishment with id ${establishmentId} from API: `, establishment)

    establishment.hasAllInfo = true
    establishments.value.set(establishmentId, establishment)

    return parseEstablishment(rawEstablishment) || undefined
  }

  function setEstablishment(establishment: Establishment) {
    // check that the establishment is not already in the map
    if (establishments.value.get(establishment.id)?.hasAllInfo) {
      return
    }

    establishments.value.set(establishment.id, establishment)
  }

  const capitalize = (s: string) => s.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())

  async function fetchIssueCategories() {
    const res: CategoriesIssue[] = await establishmentsApi.getIssueCategories().catch((e) => e)
    console.log('🔍 Fetched issue categories from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }
    categoriesIssue.value = res.map(({ id, label }) => ({
      id,
      label,
    }))
  }

  async function fetchCategories() {
    const res: Category[] = await establishmentsApi.getCategories().catch((e) => e)
    console.log('🔍 Fetched categories from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }
    categories.value = res.map(({ label }) => ({
      id: label,
      label
    }))
  }

  async function fetchCurrencies() {
    const res: Currency[] = await establishmentsApi.getCurrencies().catch((e) => e)
    console.log('🔍 Fetched currencies from the API', res)
    if (res instanceof Error) {
      console.error(res);
      // TODO Handle error
      return;
    }

    const priorityOrder = ['NIM', 'BTC']

    currencies.value = res.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.symbol)
      const bIndex = priorityOrder.indexOf(b.symbol)

      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }

  watch([selectedCategories, selectedCurrencies], async ([newCategories, newCurrencies]) => {
    router.push({
      query: {
        categories: newCategories,
        currencies: newCurrencies,
      }
    })
    await search()
  })

  watch([boundingBox], async () => await search())

  async function reportEstablishment(establishmentIssueBody: EstablishmentIssueRequest["establishmentIssueBody"]) {
    await establishmentsApi.postEstablishmentIssue({ establishmentIssueBody })
  }

  async function addCandidate(establishmentCandidateBody: CandidateRequest["establishmentCandidateBody"]) {
    await establishmentsApi.postCandidate({ establishmentCandidateBody })
  }

  onMounted(() => {
    fetchCategories()
    fetchIssueCategories()
    fetchCurrencies()
  })

  const currenciesOptions = computed(() => {
    return currencies.value.map((currency) => {
      return {
        id: currency.symbol,
        label: currency.name,
      }
    })
  })

  const categoriesOptions = computed(() => {
    return categories.value.map((category) => {
      return {
        id: category.id,
        label: category.label,
      }
    })
  })

  const suggestionsApi = ref<{ label: string, onclick: () => void }[]>([])
  async function autocompleteApi(query: string) {
    const res = await establishmentsApi.autocomplete({ query })
    const establishments = res.establishments.map((e) => ({
      label: e.name,
      onclick: () => {
        router.push(`/establishment/${e.id}`)
      }
    }))
    const currencies = res.currencies.map((c) => ({
      label: c.name,
      onclick: () => {
        selectedCurrencies.value = [c.symbol]
      }
    }))
    const categories = res.categories.map((c) => ({
      label: c.label,
      onclick: () => {
        selectedCategories.value = [c.label]
      }
    }))

    suggestionsApi.value = [...establishments, ...currencies, ...categories]
  }

  return {
    search,
    establishments,
    establishmentsInView,
    categories,
    currencies,
    categoriesIssue,
    fetchIssueCategories,
    selectedCurrencies,
    selectedCategories,
    getEstablishmentById,
    setEstablishment,
    reportEstablishment,
    addCandidate,

    // For the select component
    currenciesOptions,
    categoriesOptions, // FIXME This one should be removed

    autocompleteApi,
    suggestionsApi
  }
})