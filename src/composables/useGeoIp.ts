import { DEFAULT_ZOOM, SANTA_TERESA_COORDS, type Point } from "../stores/map";

export type GeoIpResponse = {
    location?: {
        longitude?: string,
        latitude?: string,
    },
    country?: string,
    city?: string,
    city_names?: { [language: string]: string }, // eslint-disable-line camelcase
    accuracy_radius?: number, // eslint-disable-line camelcase
}

export interface IpLocation {
    location: Point,
    zoom: number,
}

const CACHE_MAX_SIZE = 1000;
const cacheStore = new Map<string, IpLocation>();

function cached(host: string) {
    return cacheStore.get(host);
}

function cache(host: string, location: IpLocation) {
    // Clear cache
    while (cacheStore.size > CACHE_MAX_SIZE) {
        // Don't remove own location
        const oldestHost = [...cacheStore.keys()].slice(0, 2).filter((key) => !!key).slice(0, 1)[0];
        cacheStore.delete(oldestHost);
    }
    // Save in cache
    cacheStore.set(host, location);
}

async function locate(host = ''): Promise<IpLocation> {
    const cachedResponse = cached(host);
    if (cachedResponse) return cachedResponse;
    const url = new URL(`https://geoip.nimiq-network.com:8443/v1/locate`);
    if (host) url.searchParams.set('host', host);

    const response = await fetch(url)
    const json: GeoIpResponse = await response.json()

    if (!json || !json.location || !json.location.latitude || !json.location.longitude)
        return { location: SANTA_TERESA_COORDS, zoom: DEFAULT_ZOOM }

    // estimate appropiate zoom level based on accuracy radius
    // with accuracy radius of 5, a good zoom level is 13
    // with accuracy radius of 50, a good zoom level is 9
    const zoom = Math.round(Math.log2(1 / (json.accuracy_radius || 25)) + 15);

    const ipLocation: IpLocation = {
        location: {
            lat: parseFloat(json.location.latitude) || SANTA_TERESA_COORDS.lat,
            lng: parseFloat(json.location.longitude) || SANTA_TERESA_COORDS.lat
        },
        zoom
    }
    console.log(`Located ${host} at ${ipLocation.location.lat}, ${ipLocation.location.lng}`);
    cache(host, ipLocation);
    return ipLocation;
}

export function useGeoIp() {
    return {
        locate
    };
}