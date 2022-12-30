import { Configuration, EstablishmentsApi, type CryptoEstablishment as CryptoEstablishmentApi, type /** CryptoEstablishmentBaseInner */CryptoEstablishmentBase as CryptoEstablishmentBaseApi, type CurrencyInner as Currency, type PostCandidateRequest as CandidateRequest, type PostEstablishmentIssueRequest as EstablishmentIssueRequest, type SearchEstablishmentsRequest } from "@/api";
import { SuggestionType, type Suggestion } from "@/composables/useAutocomplete";
import { defineStore, storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEstablishments } from "./establishments";
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

export type BaseEstablishment = Pick<CryptoEstablishmentApi, "uuid" | "name" | "category"> & {
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

export type Establishment = Pick<BaseEstablishment, "uuid" | "name" | "category" | "geoLocation" | "currencies"> & {
  hasAllInfo: true;
  gmapsUrl: CryptoEstablishmentApi["gmaps_url"];
  gmapsPlaceId: CryptoEstablishmentApi["gmaps_place_id"];
  geoLocation: CryptoEstablishmentApi["geo_location"];
  gmapsType: CryptoEstablishmentApi["gmaps_type"];
  photoUrl?: string;
  rating: CryptoEstablishmentApi["rating"];
  address: CryptoEstablishmentApi["address"];
}

export const useApi = defineStore("api", () => {

  const { establishments } = storeToRefs(useEstablishments())

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
  const { boundingBox, surroundingBoundingBox } = storeToRefs(mapStore)

  // Converts crypto location model from the API to the model used in the app
  function parseBaseEstablishment({ uuid, name, category, geo_location: geoLocation, currencies: establishmentCurrencySymbols }: CryptoEstablishmentBaseApi): BaseEstablishment {
    const establishmentCurrencies = currencies.value.filter(c => establishmentCurrencySymbols.includes(c.symbol))
    const parsedEstablishment: BaseEstablishment = {
      uuid, name, category, geoLocation, hasAllInfo: false,
      address: undefined, gmapsPlaceId: undefined, gmapsType: undefined, gmapsUrl: undefined, photoUrl: undefined, rating: undefined,
      currencies: establishmentCurrencies,
    }
    return parsedEstablishment
  }

  function parseEstablishment({
    uuid, address, category, currencies: establishmentCurrencySymbols, gmaps_place_id, gmaps_type, gmaps_url, geo_location, name, photo_reference, rating
  }: CryptoEstablishmentApi): Establishment {
    const photoUrl = photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photo_reference}&key=${googleMapsKey}`
      : undefined
    const establishmentCurrencies = currencies.value.filter(c => establishmentCurrencySymbols.includes(c.symbol))

    const parsedEstablishment: Establishment = {
      hasAllInfo: true,
      address: address.trim(),
      category: category.trim(),
      currencies: establishmentCurrencies,
      gmapsPlaceId: gmaps_place_id.trim(),
      gmapsType: capitalize(gmaps_type.replace(/_/g, ' ')),
      gmapsUrl: gmaps_url.trim(),
      geoLocation: geo_location,
      uuid: uuid.trim(),
      name: name.trim(),
      photoUrl: photoUrl?.trim(),
      rating: rating,
    }
    return parsedEstablishment
  }

  async function search() {
    const { northEast, southWest } = surroundingBoundingBox.value
    const boundingBoxStr = `${southWest.lng},${southWest.lat},${northEast.lng},${northEast.lat}`

    const body: SearchEstablishmentsRequest = {
      filterBoundingBox: boundingBoxStr,
      filterEstablishmentCategoryLabel: selectedCategories.value || undefined,
      filterCurrency: selectedCurrencies.value || undefined,
    }

    console.log('🔍 Searching in the API: ', body)

    // const response: CryptoEstablishmentBaseApi[] = await establishmentsApi.searchEstablishments(body).catch((e) => e)
    const unformatedResponse: { [key: string]: CryptoEstablishmentBaseApi }[] = await establishmentsApi.searchEstablishments(body).catch((e) => e)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore The API is returning an object with the index as key, but it should return an array
    const response = Object.values(unformatedResponse) as CryptoEstablishmentBaseApi[]

    if (response instanceof Error) {
      console.error(response);
      // alert('The api is not available'); // TODO Handle error
      return;
    }

    response
      .map(parseBaseEstablishment)
      .sort((a, b) => b.geoLocation.lat - a.geoLocation.lat)
      .filter((e) => !establishments.value.has(e.uuid)) // ignore already loaded establishments
      .forEach((establishment) => establishments.value.set(establishment.uuid, establishment))
  }

  async function getEstablishmentByUuid(uuid: string) {
    const rawEstablishment = await establishmentsApi.getEstablishmentByUuid({ uuid }).catch((e) => e)
    const establishment = parseEstablishment(rawEstablishment) || undefined
    console.log(`🔍 Got establishment with uuid ${uuid} from API: `, establishment)

    establishment.hasAllInfo = true
    establishments.value.set(uuid, establishment)

    return parseEstablishment(rawEstablishment) || undefined
  }

  function setEstablishment(establishment: Establishment) {
    // check that the establishment is not already in the map
    if (establishments.value.get(establishment.uuid)?.hasAllInfo) {
      return
    }

    establishments.value.set(establishment.uuid, establishment)
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

    const showFirst = ['NIM', 'BTC']
    const showLast = ['bluecode', 'atm']

    currencies.value = res.sort((a, b) => {
      const aIndex = showFirst.indexOf(a.symbol)
      const bIndex = showFirst.indexOf(b.symbol)
      const aLastIndex = showLast.indexOf(a.symbol)
      const bLastIndex = showLast.indexOf(b.symbol)

      if (aIndex > -1 && bIndex > -1) return aIndex - bIndex
      if (aIndex > -1) return -1
      if (bIndex > -1) return 1
      if (aLastIndex > -1 && bLastIndex > -1) return aLastIndex - bLastIndex
      if (aLastIndex > -1) return 1
      if (bLastIndex > -1) return -1
      return 0
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

  const suggestions = ref<Suggestion[]>([])
  async function autocomplete(query: string) {
    const res = await establishmentsApi.autocomplete({ query })
    const establishments: Suggestion[] = res.establishments.map((e) => ({
      label: e.name,
      id: e.uuid,
      matchedSubstrings: [],
      type: SuggestionType.API,
      apiSuggestion: 'establishment'
    }))
    const currencies: Suggestion[] = res.currencies.map((c) => ({
      label: c.name,
      id: c.symbol,
      matchedSubstrings: [],
      type: SuggestionType.API,
      apiSuggestion: 'currency'
    }))
    const categories: Suggestion[] = res.categories.map((c) => ({
      label: c.label,
      id: c.label,
      matchedSubstrings: [],
      type: SuggestionType.API,
      apiSuggestion: 'category'

    }))

    suggestions.value = [...establishments, ...currencies, ...categories]
  }

  return {
    search,
    categories,
    currencies,
    categoriesIssue,
    fetchIssueCategories,
    selectedCurrencies,
    selectedCategories,
    getEstablishmentByUuid,
    setEstablishment,
    reportEstablishment,
    addCandidate,

    // For the select component
    currenciesOptions,
    categoriesOptions, // FIXME This one should be removed

    autocomplete,
    suggestions
  }
})