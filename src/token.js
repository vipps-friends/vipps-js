/**
 * @typedef {Object} AccessTokenResponse
 * @property {string} token_type - Always "Bearer".
 * @property {number} expires_in - Validity period in seconds.
 * @property {string} expires_on - Expiry time as a Unix timestamp (UTC).
 * @property {string} access_token - The JWT (JSON Web Token).
 */

/**
 * Internal helper to fetch a new token from Vipps.
 * 
 * @param {import('./client.js').VippsInstance} vipps 
 * @returns {Promise<AccessTokenResponse>}
 */
async function fetchToken(vipps) {
  const { clientId, clientSecret, subscriptionKey, baseUrl } = vipps.config;
  
  const response = await fetch(`${baseUrl}/accesstoken/get`, {
    method: 'POST',
    headers: {
      'client_id': clientId,
      'client_secret': clientSecret,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw { status: response.status, ...errorBody };
  }

  return response.json();
}

/**
 * Retrieves a valid access token, handling caching and renewal.
 * 
 * @param {import('./client.js').VippsInstance} vipps - The Vipps instance.
 * @returns {Promise<string>} The access token.
 */
export async function getAccessToken(vipps) {
  const now = Date.now();
  
  if (vipps._auth.token && vipps._auth.expiresAt > now + 60000) {
    return vipps._auth.token;
  }

  if (vipps.config.getToken) {
    const externalToken = await vipps.config.getToken();
    if (externalToken) {
      return externalToken;
    }
  }

  const authData = await fetchToken(vipps);
  const token = authData.access_token;
  const expiresAt = parseInt(authData.expires_on) * 1000;

  vipps._auth.token = token;
  vipps._auth.expiresAt = expiresAt;

  if (vipps.config.setToken) {
    await vipps.config.setToken(authData);
  }

  return token;
}
