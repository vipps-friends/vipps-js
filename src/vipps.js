// @ts-check

/**
 * @typedef {Object} VippsConfig
 * @property {string} clientId - The `client_id` is available on the business portal, under the Developer section. Think of it as the "username".
 * @property {string} clientSecret - The `client_secret` is available on the business portal, under the Developer section. Think of it as the "password". Keep it secret. We will never ask for it, and we don't need it for anything.
 * @property {string} subscriptionKey - The subscription key for a sales unit.
 * @property {string} merchantSerialNumber - The merchant serial number (MSN) for the sales unit. The Merchant-Serial-Number header can be used with all API keys, and can speed up any trouble-shooting of API problems quite a bit.
 * @property {boolean} [useTest=false] - Whether to use the test environment.
 * @property {string} [baseUrlProd='https://api.vippsmobilepay.com'] - The production base URL.
 * @property {string} [baseUrlDev='https://apitest.vipps.no'] - The test base URL.
 * @property {string} [systemName] - The name of the ecommerce solution. One word in lowercase letters is good.
 * @property {string} [systemVersion] - The version number of the ecommerce solution.
 * @property {string} [pluginName] - The name of the ecommerce plugin (if applicable). One word in lowercase letters is good.
 * @property {string} [pluginVersion] - The version number of the ecommerce plugin (if applicable).
 * @property {function(): Promise<string | null>} [getToken] - Optional external token getter.
 * @property {function(import("./token").AccessTokenResponse): Promise<void>} [setToken] - Optional external token setter.
 */

/**
 * @typedef {Object} Internal
 * @property {string} pluginName - The name of the ecommerce plugin (if applicable). One word in lowercase letters is good.
 * @property {string} pluginVersion - The version number of the ecommerce plugin (if applicable).
 * @property {string} baseUrl - The base URL for the API.
 * @property {string|null} token - Cached access token.
 * @property {number} expiresOn - Expiry timestamp in milliseconds.
 */

/**
 * @typedef {VippsConfig & Internal} VippsInstance
 */

/** @type {VippsInstance | null} */
let instance = null

/**
 * Initializes a Vipps instance with the provided configuration.
 * This instance should be passed as the first argument to all other library functions.
 *
 * @param {VippsConfig} config - The library configuration.
 * @returns {VippsInstance} An instance to be passed to all other functions.
 */
export function initializeVipps(config) {
  const useTest = config.useTest ?? false
  const baseUrlProd = config.baseUrlProd ?? 'https://api.vippsmobilepay.com'
  const baseUrlDev = config.baseUrlDev ?? 'https://apitest.vipps.no'
  const baseUrl = useTest ? baseUrlDev : baseUrlProd

  instance = {
    pluginName: '@vipps-friends/vipps-js',
    pluginVersion: '1.0.0',
    ...config,
    baseUrl,
    expiresOn: 0,
    token: null,
  }

  return instance
}

/**
 * Returns the Vipps instance.
 *
 * @returns {VippsInstance | null} The Vipps instance.
 */
export function getVipps() {
  return instance
}
