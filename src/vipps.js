/**
 * @typedef {Object} VippsConfig
 * @property {string} clientId - The Client ID for the sales unit.
 * @property {string} clientSecret - The Client Secret for the sales unit.
 * @property {string} subscriptionKey - The Subscription Key for the sales unit.
 * @property {string} merchantSerialNumber - Your unique Merchant Serial Number (MSN).
 * @property {boolean} [useTest=false] - Whether to use the test environment.
 * @property {string} [baseUrlProd='https://api.vippsmobilepay.com'] - The production base URL.
 * @property {string} [baseUrlDev='https://apitest.vipps.no'] - The test base URL.
 * @property {string} [systemName] - The name of your ecommerce solution or system.
 * @property {string} [systemVersion] - The version number of your system.
 * @property {string} [pluginName] - The name of the ecommerce plugin.
 * @property {string} [pluginVersion] - The version number of the plugin.
 * @property {Function} [getToken] - Optional external token getter.
 * @property {Function} [setToken] - Optional external token setter.
 */

/**
 * @typedef {Object} VippsInstance
 * @property {string} clientId
 * @property {string} clientSecret
 * @property {string} subscriptionKey
 * @property {string} merchantSerialNumber
 * @property {string} baseUrl
 * @property {string} [systemName]
 * @property {string} [systemVersion]
 * @property {string} [pluginName]
 * @property {string} [pluginVersion]
 * @property {Function} [getToken]
 * @property {Function} [setToken]
 * @property {string|null} token
 * @property {number} expiresAt
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

  if (instance) {
    return instance
  }

  const useTest = config.useTest ?? false;
  const baseUrlProd = config.baseUrlProd ?? 'https://api.vippsmobilepay.com';
  const baseUrlDev = config.baseUrlDev ?? 'https://apitest.vipps.no';
  const baseUrl = useTest ? baseUrlDev : baseUrlProd;

  instance = {
    ...config,
    baseUrl,
    token: null,
    expiresAt: 0,
  };

  return instance;
}

/**
 * Returns the Vipps instance.
 * 
 * @returns {VippsInstance | null} The Vipps instance.
 */
export function getVipps() {
  return instance;
}
