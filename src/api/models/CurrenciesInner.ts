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
 * @interface CurrenciesInner
 */
export interface CurrenciesInner {
    /**
     * 
     * @type {string}
     * @memberof CurrenciesInner
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CurrenciesInner
     */
    symbol: string;
}

/**
 * Check if a given object implements the CurrenciesInner interface.
 */
export function instanceOfCurrenciesInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "symbol" in value;

    return isInstance;
}

export function CurrenciesInnerFromJSON(json: any): CurrenciesInner {
    return CurrenciesInnerFromJSONTyped(json, false);
}

export function CurrenciesInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): CurrenciesInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'symbol': json['symbol'],
    };
}

export function CurrenciesInnerToJSON(value?: CurrenciesInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'symbol': value.symbol,
    };
}
