let instance = null

/**
 * Initializes a Vipps instance with the provided configuration.
 * This instance should be passed as the first argument to all other library functions.
 * 
 * @param {import('./types.js').VippsConfig} config - The library configuration.
 * @returns {import('./types.js').VippsInstance} An instance to be passed to all other functions.
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
 * @returns {import('./types.js').VippsInstance} The Vipps instance.
 */
export function getVipps() {
  return instance;
}

