/**
 * @typedef {Object} SignatureHeaders
 * @property {string} host - The host header.
 * @property {string} x-ms-date - The date header.
 * @property {string} x-ms-signature - The signature header.
 * @property {string} x-ms-content-sha256 - The content SHA256 header.
 */

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
