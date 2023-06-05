/* tslint:disable */
/* eslint-disable */
/**
 * Crypto Map API documentation
 * The Establishments map API is serves a list of establishments that accept crypto as a payment method.
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { GetProviders200ResponseInnerCta } from './GetProviders200ResponseInnerCta';
import {
    GetProviders200ResponseInnerCtaFromJSON,
    GetProviders200ResponseInnerCtaFromJSONTyped,
    GetProviders200ResponseInnerCtaToJSON,
} from './GetProviders200ResponseInnerCta';
import type { GetProviders200ResponseInnerStyle } from './GetProviders200ResponseInnerStyle';
import {
    GetProviders200ResponseInnerStyleFromJSON,
    GetProviders200ResponseInnerStyleFromJSONTyped,
    GetProviders200ResponseInnerStyleToJSON,
} from './GetProviders200ResponseInnerStyle';

/**
 * 
 * @export
 * @interface GetProviders200ResponseInner
 */
export interface GetProviders200ResponseInner {
buy: any;
[x: string]: any;
    /**
     * 
     * @type {number}
     * @memberof GetProviders200ResponseInner
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof GetProviders200ResponseInner
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof GetProviders200ResponseInner
     */
    messageEn: string;
    /**
     * 
     * @type {string}
     * @memberof GetProviders200ResponseInner
     */
    messageEs: string;
    /**
     * 
     * @type {string}
     * @memberof GetProviders200ResponseInner
     */
    messageDe: string;
    /**
     * 
     * @type {string}
     * @memberof GetProviders200ResponseInner
     */
    logo: string;
    /**
     * 
     * @type {GetProviders200ResponseInnerStyle}
     * @memberof GetProviders200ResponseInner
     */
    style: GetProviders200ResponseInnerStyle;
    /**
     * 
     * @type {GetProviders200ResponseInnerCta}
     * @memberof GetProviders200ResponseInner
     */
    cta: GetProviders200ResponseInnerCta;
}

/**
 * Check if a given object implements the GetProviders200ResponseInner interface.
 */
export function instanceOfGetProviders200ResponseInner(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "messageEn" in value;
    isInstance = isInstance && "messageEs" in value;
    isInstance = isInstance && "messageDe" in value;
    isInstance = isInstance && "logo" in value;
    isInstance = isInstance && "style" in value;
    isInstance = isInstance && "cta" in value;

    return isInstance;
}

export function GetProviders200ResponseInnerFromJSON(json: any): GetProviders200ResponseInner {
    return GetProviders200ResponseInnerFromJSONTyped(json, false);
}

export function GetProviders200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetProviders200ResponseInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'messageEn': json['message_en'],
        'messageEs': json['message_es'],
        'messageDe': json['message_de'],
        'logo': json['logo'],
        'style': GetProviders200ResponseInnerStyleFromJSON(json['style']),
        'cta': GetProviders200ResponseInnerCtaFromJSON(json['cta']),
    };
}

export function GetProviders200ResponseInnerToJSON(value?: GetProviders200ResponseInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'message_en': value.messageEn,
        'message_es': value.messageEs,
        'message_de': value.messageDe,
        'logo': value.logo,
        'style': GetProviders200ResponseInnerStyleToJSON(value.style),
        'cta': GetProviders200ResponseInnerCtaToJSON(value.cta),
    };
}

