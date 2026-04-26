// @ts-check

import { request } from './common.js'

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
 * Retrieves a valid access token, handling caching and renewal.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @returns {Promise<string>} The access token.
 */
export async function getAccessToken(vipps) {
  const {
    token: cachedToken,
    expiresOn,
    getToken,
    setToken,
    clientId,
    clientSecret,
    baseUrl,
  } = vipps
  const now = Date.now()

  if (cachedToken && expiresOn > now + 60000) {
    return cachedToken
  }

  if (getToken) {
    const externalToken = await getToken()
    if (externalToken) {
      return externalToken
    }
  }

  /** @type {AccessTokenResponse} */
  const response = await request(vipps, 'POST', `${baseUrl}/accesstoken/get`, {
    headers: {
      client_id: clientId,
      client_secret: clientSecret,
    },
  })

  const { access_token, expires_on } = response

  vipps.token = access_token
  vipps.expiresOn = parseInt(expires_on, 10) * 1000

  if (setToken) {
    await setToken(response)
  }

  return vipps.token
}
