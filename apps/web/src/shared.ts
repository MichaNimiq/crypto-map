import { PROVIDERS } from 'database'
import type { DatabaseAnonArgs, DatabaseArgs, Location } from 'types'
import { DatabaseUser, LocationLink, Provider, Theme } from 'types'
import { getCardConfiguration } from './assets-dev/banner-assets'
import { translateCategory } from './translations'
import { useApp } from './stores/app'

const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAP_KEY

export const DATABASE_ARGS: DatabaseArgs = {
  url: import.meta.env.VITE_DATABASE_URL,
  apikey: import.meta.env.VITE_DATABASE_KEY,
}

export async function getAnonDatabaseArgs(): Promise<DatabaseAnonArgs> {
  await useApp().init()
  return { ...DATABASE_ARGS, captchaToken: useApp().captchaTokenUuid, user: DatabaseUser.Anonymous }
}

export function parseLocation(location: Location) {
  const isAtm = location.sells.length > 0

  if (!location.provider || !PROVIDERS.includes(location.provider)) {
    console.warn(`Unknown provider: '${location.provider}'. Setting ${location.provider} provider. Location: ${JSON.stringify(location)}`)
    location.provider = isAtm ? Provider.DefaultAtm : Provider.DefaultShop
  }
  else if (isAtm && location.provider === Provider.DefaultShop) {
    location.provider = Provider.DefaultAtm
  }

  // If the photo is not a URL, then it's a reference to Google Maps
  const hasPhotoUrl = location.photo?.startsWith('http')
  if (!hasPhotoUrl) {
    if (location.photo) {
      // location.photo is a base64 photo reference
      location.photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${location.photo}&key=${GOOGLE_MAPS_API}`
    }
    else {
      location.photo = undefined
    }
  }

  // Prioritize links in this order: 1. Google Maps -> 2. Instagram -> 3. Facebook
  location.linkTo = location.gmaps ? LocationLink.GMaps : location.instagram ? LocationLink.Instagram : location.facebook ? LocationLink.Facebook : undefined
  location.url = location.gmaps || location.instagram || location.facebook

  Object.assign(location, getCardConfiguration(location.provider)) // Assing all the keys from the asset to the location

  location.isAtm = isAtm
  location.isDark = location.theme === Theme.Dark
  location.isLight = location.theme === Theme.Light

  // Make the translation reactive in case user change language
  Object.defineProperty(location, 'category_label', {
    get: () => translateCategory(location.category),
  })
  return location
}
