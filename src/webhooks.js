import { request } from './common.js'
import { getAccessToken } from './token.js'

/**
 * @typedef {Object} SignatureHeaders
 * @property {string} host - The host header.
 * @property {string} x-ms-date - The date header.
 * @property {string} x-ms-signature - The signature header.
 * @property {string} x-ms-content-sha256 - The content SHA256 header.
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} url - The URL that updates should be sent to. Must be a valid, world-reachable URL. The URL must use HTTPS. Can not be a URL that redirects to a different URL. We don't send requests to all ports, so to be safe use common ports such as: 80, 443, 8080.
 * @property {string[]} events - See [Webhooks API Events](https://developer.vippsmobilepay.com/docs/APIs/webhooks-api/events/) for details.
 */

/**
 * @typedef {Object} RegisterResponse
 * @property {string} id - uuid
 * @property {string} secret - secret
 */

/**
 * @typedef {Object} Webhook
 * @property {string} id - uuid
 * @property {string} url - The URL that updates should be sent to. Must be a valid, world-reachable URL. The URL must use HTTPS. Can not be a URL that redirects to a different URL. We don't send requests to all ports, so to be safe use common ports such as: 80, 443, 8080.
 * @property {string[]} events - See [Webhooks API Events](https://developer.vippsmobilepay.com/docs/APIs/webhooks-api/events/) for details.
 */

/**
 * @typedef {Object} QueryResponse
 * @property {Webhook[]} webhooks - List of registered webhooks.
 */

/**
 * Get all registered webhooks.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @returns {Promise<QueryResponse>} List of registered webhooks.
 */
export async function getWebhooks(vipps) {
  const token = await getAccessToken(vipps)
  const { baseUrl } = vipps

  return request(vipps, 'GET', `${baseUrl}/webhooks/v1/webhooks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Register webhook.
 *
 * At most 25 webhooks can currently be registered per event, please reach
 * out if a higher limit is required.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {RegisterRequest} body - The webhook registration request.
 * @returns {Promise<RegisterResponse>} The registration response.
 */
export async function registerWebhook(vipps, body) {
  const token = await getAccessToken(vipps)
  const { baseUrl } = vipps

  return request(vipps, 'POST', `${baseUrl}/webhooks/v1/webhooks`, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Delete webhook.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} id - uuid
 * @returns {Promise<void>} Resolves when the webhook is deleted.
 */
export async function deleteWebhook(vipps, id) {
  const token = await getAccessToken(vipps)
  const { baseUrl } = vipps

  return request(vipps, 'DELETE', `${baseUrl}/webhooks/v1/webhooks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Verifies the integrity and signature of a Vipps MobilePay webhook.
 *
 * @param {string} rawBody - The raw request body as a string.
 * @param {SignatureHeaders} headers - The request headers.
 * @param {string} webhookSecret - The secret for the webhook.
 * @returns {Promise<boolean>} True if the webhook is valid.
 */
export async function verifyWebhook(rawBody, headers, webhookSecret) {
  const {
    'x-ms-content-sha256': contentSha256,
    'x-ms-signature': signature,
    'x-ms-date': date,
    host,
  } = headers

  const encoder = new TextEncoder()
  const data = encoder.encode(rawBody)

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const calculatedContentSha256 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))

  if (contentSha256 !== calculatedContentSha256) {
    return false
  }

  const stringToSign = `${date}\n${host}\n${contentSha256}`
  const stringToSignBuffer = encoder.encode(stringToSign)

  const keyBuffer = encoder.encode(webhookSecret)
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['verify'],
  )

  const signatureBuffer = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0))

  return crypto.subtle.verify('HMAC', key, signatureBuffer, stringToSignBuffer)
}
