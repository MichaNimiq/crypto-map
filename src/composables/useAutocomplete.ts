import { useApp } from "@/stores/app";
import { useApi, type AppSuggestion } from "@/stores/api";
import { storeToRefs } from "pinia";
import { ref } from "vue";

export enum AutocompleteStatus {
  LOADING = "loading",
  WITH_RESULTS = "with-results",
  NO_RESULTS = "no-results",
  ERROR = "error",
}

export type Suggestion =
  | { v: google.maps.places.AutocompletePrediction, source: 'google' }
  | { v: AppSuggestion, source: 'api' }

type UseAutocompleteOptions = {
  types: string[],
  sources: ('google' | 'api')[]

}
const defaultOptions: UseAutocompleteOptions = {
  types: [],
  sources: ['google', 'api']
}

export function useAutocomplete({ types, sources }: UseAutocompleteOptions = defaultOptions) {
  const status = ref<AutocompleteStatus>(AutocompleteStatus.NO_RESULTS);
  const suggestions = ref<Suggestion[]>([]);

  const appStore = useApp()
  const { autocomplete: autocompleteGoogle } = appStore;
  const { suggestions: suggestionsGoogle } = storeToRefs(appStore)

  const apiStore = useApi()
  const { autocomplete: autocompleteApi } = apiStore;
  const { suggestions: suggestionsApi } = storeToRefs(apiStore);

  async function fetchAutocompleteApi(query: string): Promise<Suggestion[]> {
    await autocompleteApi(query).catch(() => {
      status.value = AutocompleteStatus.ERROR;
    })

    if (suggestionsApi.value.length) {
      status.value = AutocompleteStatus.WITH_RESULTS;
    }

    return suggestionsApi.value.map(v => ({ v, source: 'api' }))
  }

  async function fetchAutocompleteGoogle(query: string): Promise<Suggestion[]> {
    await autocompleteGoogle(query, types).catch(() => {
      status.value = AutocompleteStatus.ERROR;
    })

    if (suggestionsGoogle.value.length) {
      status.value = AutocompleteStatus.WITH_RESULTS;
    }

    return suggestionsGoogle.value.map(s => ({ v: s, source: 'google' }))
  }

  async function autocomplete(query: string) {
    status.value = AutocompleteStatus.LOADING;

    if (sources.includes('api') && sources.includes('google')) {
      suggestions.value = [...await Promise.all([
        fetchAutocompleteApi(query),
        fetchAutocompleteGoogle(query)
      ])].reduce((acc, val) => acc.concat(val), [])
    } else if (sources.includes('api')) {
      // rewrite suggestions
      suggestions.value = await fetchAutocompleteApi(query)
    } else if (sources.includes('google')) {
      suggestions.value = await fetchAutocompleteGoogle(query)
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