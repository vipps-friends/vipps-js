/**
 * @typedef {Object} AccessTokenResponse
 * @property {string} token_type - The type for the access token. This will always be `Bearer`.
 * @property {number} expires_in - Token expiry time in seconds. The access token is valid for 1 hour in the test environment and 24 hours in the production environment.
 * @property {string} ext_expires_in - Extra time added to expiry time. Currently disabled.
 * @property {string} expires_on - Token expiry time in epoch time format.
 * @property {string} not_before - Token creation time in epoch time format.
 * @property {string} resource - A common resource object. Not used in token validation. This can be disregarded.
 * @property {string} access_token - The access token itself. It is a base64-encoded string, typically 1000+ characters. It can be decoded on https://jwt.io, and using standard libraries. See the documentation for details.
 */

/**
 * Internal helper to fetch a new token from Vipps.
 *
 * @param {import('./vipps.js').VippsInstance} vipps
 * @returns {Promise<AccessTokenResponse>}
 */
async function fetchToken(vipps) {
  const { clientId, clientSecret, subscriptionKey, baseUrl } = vipps

  const response = await fetch(`${baseUrl}/accesstoken/get`, {
    headers: {
      client_id: clientId,
      client_secret: clientSecret,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    method: 'POST',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw { status: response.status, ...errorBody }
  }

  return response.json()
}

/**
 * Retrieves a valid access token, handling caching and renewal.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @returns {Promise<string>} The access token.
 */
export async function getAccessToken(vipps) {
  const now = Date.now()

  if (vipps.token && vipps.expiresAt > now + 60000) {
    return vipps.token
  }

  if (vipps.getToken) {
    const externalToken = await vipps.getToken()
    if (externalToken) {
      return externalToken
    }
  }

  const authData = await fetchToken(vipps)
  const token = authData.access_token
  const expiresAt = parseInt(authData.expires_on, 10) * 1000

  vipps.token = token
  vipps.expiresAt = expiresAt

  if (vipps.setToken) {
    await vipps.setToken(authData)
  }

  return token
}
