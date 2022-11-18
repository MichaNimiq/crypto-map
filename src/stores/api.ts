import { Configuration, EstablishmentsApi, type CryptoEstablishment as CryptoEstablishmentApi, type SearchEstablishmentsRequest, type CurrencyInner as Currency, type PostEstablishmentIssueRequest as EstablishmentIssueRequest, type PostCandidateRequest as CandidateRequest } from "@/api";
import { defineStore, storeToRefs } from "pinia";
import { computed, onMounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMap, type BoundingBox } from "./map";

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

// TODO - this is an future improvement
// export type BaseCryptoEstablishment = {
//   id: number;
//   name: string;
//   category: string;
//   geoEstablishment: {
//     lng: number;
//     lat: number;
//   };
// }
// export type CryptoEstablishment = BaseCryptoEstablishment & {

export type Establishment =
  Pick<CryptoEstablishmentApi, "id" | "name" | "rating" | "address" | "category"> & {
    gmapsUrl: CryptoEstablishmentApi["gmaps_url"],
    gmapsPlaceId: CryptoEstablishmentApi["gmaps_place_id"],
    geoLocation: CryptoEstablishmentApi["geo_location"],
    gmapsType: CryptoEstablishmentApi["gmaps_type"],
    photoUrl: string;
    currencies: Currency[];
  }

export const useApi = defineStore("api", () => {
  // Data from API
  const establishments = ref<Establishment[]>([])
  const categoriesIssue = ref<CategoriesIssue[]>([])
  const categories = ref<Category[]>([])
  const currencies = ref<Currency[]>([])

  const route = useRoute()
  const router = useRouter()

  const mapStore = useMap()
  const { boundingBox } = storeToRefs(mapStore)

  // Converts crypto location model from the API to the model used in the app
  function parseEstablishment({
    id, address, category, currencies: establishmentCurrencySymbols, gmaps_place_id, gmaps_type, gmaps_url, geo_location, name, photo_reference, rating
  }: CryptoEstablishmentApi): Establishment {
    const photoUrl = photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photo_reference}&key=${googleMapsKey}`
      : "https://via.placeholder.com/540x540?text=No+photo+available" // TODO use a better placeholder
    const establishmentCurrencies = currencies.value.filter(c => establishmentCurrencySymbols.includes(c.symbol))

    const parsedEstablishment: Establishment = {
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

    const response: CryptoEstablishmentApi[] = await establishmentsApi.searchEstablishments(body).catch((e) => e)

    if (response instanceof Error) {
      console.error(response);
      // alert('The api is not available'); // TODO Handle error
      return;
    }

    establishments.value = response
      .map(parseEstablishment)
      .sort((a, b) => b.geoLocation.lat - a.geoLocation.lat)
  }

  async function getEstablishmentById(establishmentId: string) {
    const rawEstablishment = await establishmentsApi.getEstablishmentById({ establishmentId }).catch((e) => e)
    return parseEstablishment(rawEstablishment) || undefined
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
    categoriesIssue.value = res.map(r => ({
      id: r.id,
      label: capitalize(r.label.replace(/_/g, ' '))
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
    categories.value = res.map(r => ({
      id: r.label,
      label: capitalize(r.label.replace(/_/g, ' & '))
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

  function pathParamToStringList(param: 'currencies' | 'categories') {
    const values = route.params[param] as string
    if (!values) return []
    if (typeof values === 'string') return [values]
    return values
  }

  const selectedCurrencies = ref(pathParamToStringList('currencies'))
  const selectedCategories = ref(pathParamToStringList('categories'))

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

  return {
    search,
    establishments,
    categories,
    currencies,
    categoriesIssue,
    fetchIssueCategories,
    selectedCurrencies,
    selectedCategories,
    getEstablishmentById,
    reportEstablishment,
    addCandidate,

    // For the select component
    currenciesOptions,
    categoriesOptions // FIXME This one should be removed
  }
})