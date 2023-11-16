import type { Category, Currency } from './database.js'

export * from './database.js'
export * from './map.js'
export * from './location.js'
export * from './autocomplete.js'
export * from './cryptocity.js'

export enum Issue {
  LOCATION_GONE = 'location_gone',
  MISSING_CURRENCY = 'missing_currency',
  MISSING_NOT_ACCEPTED = 'missing_not_accepted',
  NO_CRYPTO = 'no_crypto',
  OTHER = 'other',
}

export interface Filters {
  categories: Category[]
  currencies: Currency[]
}

export interface CaptchaUuid {
  uuid: string
  expiration_date: string
}
