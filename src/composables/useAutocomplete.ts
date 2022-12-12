import { useGoogle } from "@/stores/google";
import { useApi } from "@/stores/api";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export enum SuggestionType {
  API_ESTABLISHMENT = "apiEstablishment",
  GOOGLE_ESTABLISHMENT = "googleEstablishment",
  CURRENCY = "currency",
  CATEGORY = "category",
}

export type Suggestion = {
  label: string,
  matchedSubstrings: google.maps.places.AutocompletePrediction["matched_substrings"]
  type: SuggestionType,

  // values for id
  // apiEstablishment -> Establishment UUID
  // googleEstablishment -> google place id
  // currency -> currency symbol
  // category -> category label
  id: string,
}

export enum AutocompleteStatus {
  LOADING = "loading",
  WITH_RESULTS = "with-results",
  NO_RESULTS = "no-results",
  ERROR = "error",
}

type UseAutocompleteOptions = {
  googleTypes: string[], // See https://developers.google.com/maps/documentation/javascript/places-autocomplete#place_types. e.g. geocode, address, region, establishment, etc.
  types?: SuggestionType[]
}


export function useAutocomplete({ googleTypes, types }: UseAutocompleteOptions) {
  if (!types || types.length === 0) types = [SuggestionType.API_ESTABLISHMENT, SuggestionType.GOOGLE_ESTABLISHMENT, SuggestionType.CURRENCY, SuggestionType.CATEGORY];

  const status = ref<AutocompleteStatus>(AutocompleteStatus.NO_RESULTS);
  const suggestions = ref<Suggestion[]>([]);

  const googleStore = useGoogle()
  const { autocomplete: autocompleteGoogle } = googleStore;
  const { suggestions: suggestionsGoogle } = storeToRefs(googleStore)

  const apiStore = useApi()
  const { autocomplete: autocompleteApi } = apiStore;
  const { suggestions: suggestionsApi } = storeToRefs(apiStore);

  async function fetchAutocompleteApi(query: string) {
    await autocompleteApi(query).catch(() => {
      status.value = AutocompleteStatus.ERROR;
    })

    if (suggestionsApi.value.length) {
      status.value = AutocompleteStatus.WITH_RESULTS;
    }
  }

  async function fetchAutocompleteGoogle(query: string) {
    await autocompleteGoogle(query, googleTypes).catch(() => {
      status.value = AutocompleteStatus.ERROR;
    })

    if (suggestionsGoogle.value.length) {
      status.value = AutocompleteStatus.WITH_RESULTS;
    }
  }

  async function autocomplete(query: string) {
    status.value = AutocompleteStatus.LOADING;

    // There is no such filter in the API, so we need to fetch all the suggestions
    const hasApiSuggestions = types?.includes(SuggestionType.API_ESTABLISHMENT) || types?.includes(SuggestionType.CATEGORY) || types?.includes(SuggestionType.CURRENCY);
    const hasGoogleSuggestions = types?.includes(SuggestionType.GOOGLE_ESTABLISHMENT);

    if (hasApiSuggestions && hasGoogleSuggestions) {
      await Promise.all([fetchAutocompleteApi(query), fetchAutocompleteGoogle(query)])
      suggestions.value = [...suggestionsApi.value, ...suggestionsGoogle.value]
    } else if (hasApiSuggestions) {
      await fetchAutocompleteApi(query)
      suggestions.value = suggestionsApi.value
    } else if (hasGoogleSuggestions) {
      await fetchAutocompleteGoogle(query)
      suggestions.value = suggestionsGoogle.value
    }

    if (suggestions.value.length === 0) {
      status.value = AutocompleteStatus.NO_RESULTS;
    }
  }

  return {
    autocomplete,
    suggestions,
    status
  }
}