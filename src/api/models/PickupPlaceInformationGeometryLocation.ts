/* tslint:disable */
/* eslint-disable */
/**
 * Crypto Map API documentation
 * The Shop Directory API is serves a list of shops that accept crypto as a payment method.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface PickupPlaceInformationGeometryLocation
 */
export interface PickupPlaceInformationGeometryLocation {
    /**
     * 
     * @type {number}
     * @memberof PickupPlaceInformationGeometryLocation
     */
    lat: number;
    /**
     * 
     * @type {number}
     * @memberof PickupPlaceInformationGeometryLocation
     */
    lng: number;
}

/**
 * Check if a given object implements the PickupPlaceInformationGeometryLocation interface.
 */
export function instanceOfPickupPlaceInformationGeometryLocation(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "lat" in value;
    isInstance = isInstance && "lng" in value;

    return isInstance;
}

export function PickupPlaceInformationGeometryLocationFromJSON(json: any): PickupPlaceInformationGeometryLocation {
    return PickupPlaceInformationGeometryLocationFromJSONTyped(json, false);
}

export function PickupPlaceInformationGeometryLocationFromJSONTyped(json: any, ignoreDiscriminator: boolean): PickupPlaceInformationGeometryLocation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'lat': json['lat'],
        'lng': json['lng'],
    };
}

export function PickupPlaceInformationGeometryLocationToJSON(value?: PickupPlaceInformationGeometryLocation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'lat': value.lat,
        'lng': value.lng,
    };
}

