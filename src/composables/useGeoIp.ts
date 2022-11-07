import type { Point } from "../stores/map";

export type GeoIpResponse = {
    location?: {
        longitude?: string,
        latitude?: string,
    },
    country?: string,
    city?: string,
    city_names?: { [language: string]: string }, // eslint-disable-line camelcase
}

// Center of Europe by default
const DEFAULT_LOCATION = { lat: 50.8503, lng: 12.8510535 }


const CACHE_MAX_SIZE = 1000;
const cacheStore = new Map<string, Point>();

function cached(host: string) {
    return cacheStore.get(host);
}

function cache(host: string, location: Point) {
    // Clear cache
    while (cacheStore.size > CACHE_MAX_SIZE) {
        // Don't remove own location
        const oldestHost = [...cacheStore.keys()].slice(0, 2).filter((key) => !!key).slice(0, 1)[0];
        cacheStore.delete(oldestHost);
    }
    // Save in cache
    cacheStore.set(host, location);
}

async function locate(host = ''): Promise<Point> {
    const cachedResponse = cached(host);
    if (cachedResponse) return cachedResponse;
    const url = new URL(`https://geoip.nimiq-network.com:8443/v1/locate`);
    if (host) url.searchParams.set('host', host);

    const response = await fetch(url)
    const json: GeoIpResponse = await response.json()

    if (!json || !json.location || !json.location.latitude || !json.location.longitude) return DEFAULT_LOCATION
    const location = {
        lat: parseFloat(json.location.latitude) || DEFAULT_LOCATION.lat,
        lng: parseFloat(json.location.longitude) || DEFAULT_LOCATION.lat
    }
    cache(host, location);
    return location;
}

export function useGeoIp() {
    return {
        locate
    };
}