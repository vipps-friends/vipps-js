/**
 * @typedef {Object} VippsConfig
 * @property {string} clientId - The Client ID for the sales unit.
 * @property {string} clientSecret - The Client Secret for the sales unit.
 * @property {string} subscriptionKey - The Subscription Key for the sales unit.
 * @property {string} merchantSerialNumber - Your unique Merchant Serial Number (MSN).
 * @property {boolean} [useTestMode=false] - Whether to use the test environment.
 * @property {string} [systemName] - The name of your ecommerce solution or system.
 * @property {string} [systemVersion] - The version number of your system.
 * @property {string} [pluginName] - The name of the ecommerce plugin.
 * @property {string} [pluginVersion] - The version number of the plugin.
 * @property {Function} [getToken] - Optional external token getter.
 * @property {Function} [setToken] - Optional external token setter.
 */

/**
 * @typedef {Object} VippsInstance
 * @property {VippsConfig} config - The library configuration.
 * @property {Object} _auth - Internal state for token caching.
 * @property {string|null} _auth.token - Cached access token.
 * @property {number} _auth.expiresAt - Expiry timestamp in milliseconds.
 */

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
  instance = {
    config: {
      useTestMode: false,
      ...config,
    },
    _auth: {
      token: null,
      expiresAt: 0,
    },
  };

  return instance;
}

/**
 * Returns the Vipps instance.
 * 
 * @returns {VippsInstance} The Vipps instance.
 */
export function getVipps() {
  return instance;
}
