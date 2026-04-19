import { getAccessToken } from './token.js'

/**
 * @typedef {Object} Amount
 * @property {number} value - Amounts are specified in minor units (i.e., integers with two trailing zeros). For example: 10.00 NOK should be written as 1000. The minimum amounts allowed are NOK 100 øre, DKK 1 øre, EUR 1 cent, SEK 100 öre, USD 1 cent, GBP 1 penny. The maximum amount for this API is 65000000 minor units (i.e., 650000.00 NOK) - see the amount limits on the help pages for more details. Note: SEK, USD, and GBP are only supported for `CARD_PASSTHROUGH` payments.
 * @property {'NOK' | 'DKK' | 'EUR' | 'SEK' | 'USD' | 'GBP'} currency - Available types of currency are NOK, DKK, EUR, SEK, USD, and GBP. ISO 4217 (3 uppercase letters). Note: SEK, USD, and GBP are only supported for `CARD_PASSTHROUGH` payments.
 */

/**
 * @typedef {Object} PaymentMethod
 * @property {'WALLET' | 'CARD' | 'CARD_PASSTHROUGH'} type - The paymentMethod type to be performed. `WALLET` is a card used in the Vipps or MobilePay app. `CARD` is free-standing card payments, outside of the Vipps or MobilePay app. `CARD` has to be combined with a `userFlow` of `WEB_REDIRECT`, as the card payment can not be completed in the Vipps or MobilePay app. `CARD_PASSTHROUGH` is a PSP-initiated card payment with passthrough data, which must be combined with `cardPassthrough` details. (Preview: `CARD_PASSTHROUGH` is in preview and may change or be removed without notice.)
 */

/**
 * @typedef {Object} Customer
 * @property {string} phoneNumber - The phone number of the user paying the transaction with Vipps MobilePay. The format is MSISDN: Digits only: Country code and subscriber number, but no prefix. If the phone number is a Norwegian phone number `(+47) 12 34 56 78`, the MSISDN representation is `4712345678`. See: https://en.wikipedia.org/wiki/MSISDN
 */

/**
 * @typedef {Object} CreatePaymentRequest
 * @property {Amount} amount - Amount object, containing a `value` and a `currency`.
 * @property {string} reference - Your unique identifier for the payment (8–64 characters).
 * @property {PaymentMethod} paymentMethod - The paymentMethod type to be performed.
 * @property {'WEB_REDIRECT' | 'PUSH_MESSAGE' | 'QR' | 'NATIVE_REDIRECT'} userFlow - The flow for bringing the user to the Vipps or MobilePay app's payment confirmation screen. If `userFlow` is `PUSH_MESSAGE`, a valid value for `customer` is required. If `userFlow` is `WEB_REDIRECT`, a valid value for `returnUrl` is required. `WEB_REDIRECT` is the normal flow for browser-based payment flows. If on a mobile device, the Vipps or MobilePay app will open. A valid value for `returnUrl` is required. Otherwise, the landing page will open. `PUSH_MESSAGE` is to skip the landing page for payments initiated on a device other than the user's phone. The user gets a push message that opens the payment in the app. This requires a valid `customer` field. `QR` returns a QR code that can be scanned to complete the payment. `NATIVE_REDIRECT` is not recommended, except in some cases where merchant doesn’t have web presence. It provides automatic app-switch between the merchant's native app and the Vipps or MobilePay app. We recommend using `WEB_REDIRECT` instead.
 * @property {string} [returnUrl] - The URL the user is returned to after the payment session. The URL must use the `https://` scheme or a custom URL scheme.
 * @property {string} [paymentDescription] - The payment description summary that will be provided to the user through the Vipps MobilePay app, the business portal, and the settlement files. See the recommendations for description text.
 * @property {Customer} [customer] - The target customer if the identity is known.
 * @property {string} [expiresAt] - Only relevant for Long-living payment requests, which require special approval. The payment will expire at the given date and time. The format must adhere to RFC 3339. The value must be more than 10 minutes and less than 60 days in the future. If `ExpiresAt` is set, `receipt` also must be set.
 * @property {Object} [metadata] - Metadata is a key-value map that can be used to store additional information about the payment. The metadata is not used by Vipps MobilePay, but is passed through in the `GetPaymentResponse` object. Key length is limited to 100 characters, and value length is limited to 500 characters. Max capacity is 5 key-value pairs.
 */

/**
 * @typedef {Object} PaymentResponse
 * @property {string} reference - The `reference` is the unique identifier for the payment, specified when initiating the payment. The reference must be unique for the sales unit (MSN), but is not _globally_ unique, so several MSNs may use the same reference.
 * @property {string} redirectUrl - The URL to which the user is redirected when continuing the payment for `NATIVE_REDIRECT` and `WEB_REDIRECT`. When `userFlow` is `QR`, a link to the QR image (or the target URL) will be returned. Nothing will be returned when `userFlow` is `PUSH_MESSAGE`.
 */

/**
 * @typedef {Object} PaymentAggregate
 * @property {Amount} authorizedAmount - The total amount authorized (reserved) by the customer.
 * @property {Amount} capturedAmount - The total amount successfully captured so far.
 * @property {Amount} refundedAmount - The total amount that has been refunded after capture.
 * @property {Amount} cancelledAmount - The total amount that has been cancelled.
 */

/**
 * @typedef {Object} PaymentDetails
 * @property {string} reference - The `reference` is the unique identifier for the payment, specified when initiating the payment.
 * @property {'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'CANCELLED' | 'REFUNDED' | 'ABORTED' | 'EXPIRED' | 'TERMINATED'} state - The state of the Payment. One of: `CREATED`: The user has not yet acted upon the payment. `ABORTED`: The user has aborted the payment before authorization. This is a final state. `EXPIRED`: The user did not act on the payment within the payment expiration time. This is a final state. `AUTHORIZED`: The user has approved the payment. This is a final state. `TERMINATED`: The merchant has terminated the payment via the cancelPayment endpoint. This is a final state.
 * @property {Amount} amount - Amount object, containing a `value` and a `currency`.
 * @property {PaymentAggregate} aggregate - Summary of all financial actions taken on this reference.
 * @property {PaymentMethod} paymentMethod - The paymentCard's Bank Identification Number (BIN), that identifies which bank has issued the card. The BIN will be returned, if available.
 * @property {string} pspReference - Each payment operation (i.e., create, capture, refund, cancel) will have a unique `pspReference`, defined by Vipps MobilePay.
 * @property {Object} [metadata] - Metadata is a key-value map that can be used to store additional information about the payment.
 */

/**
 * @typedef {Object} AdjustmentResponse
 * @property {PaymentAggregate} aggregate - Summary of all financial actions taken on this reference.
 */

/**
 * @typedef {Object} CapturePaymentRequest
 * @property {Amount} modificationAmount - The amount to capture.
 */

/**
 * @typedef {Object} RefundPaymentRequest
 * @property {Amount} modificationAmount - The amount to refund.
 */

/**
 * Internal helper to send a request to the ePayment API.
 *
 * @param {import('./vipps.js').VippsInstance} vipps
 * @param {string} method
 * @param {string} path
 * @param {Object} [body]
 * @param {string} [idempotencyKey]
 * @returns {Promise<any>}
 */
async function sendRequest(vipps, method, path, body, idempotencyKey) {
  const token = await getAccessToken(vipps)
  const {
    baseUrl,
    subscriptionKey,
    merchantSerialNumber,
    systemName,
    systemVersion,
    pluginName,
    pluginVersion,
  } = vipps

  /** @type {Record<string, string>} */
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Merchant-Serial-Number': merchantSerialNumber,
    'Ocp-Apim-Subscription-Key': subscriptionKey,
  }

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey
  }

  if (systemName) {
    headers['Vipps-System-Name'] = systemName
  }
  if (systemVersion) {
    headers['Vipps-System-Version'] = systemVersion
  }
  if (pluginName) {
    headers['Vipps-System-Plugin-Name'] = pluginName
  }
  if (pluginVersion) {
    headers['Vipps-System-Plugin-Version'] = pluginVersion
  }

  const response = await fetch(`${baseUrl}/epayment/v1/payments${path}`, {
    body: body ? JSON.stringify(body) : undefined,
    headers,
    method,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw { status: response.status, ...errorBody }
  }

  return response.json()
}

/**
 * Initiates a new payment session.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {CreatePaymentRequest} body - The payment request body.
 * @returns {Promise<PaymentResponse>} The payment response from Vipps.
 */
export async function createPayment(vipps, body) {
  return sendRequest(vipps, 'POST', '', body, body.reference)
}

/**
 * Retrieves the current status and details of a payment.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @returns {Promise<PaymentDetails>} The current state of the payment.
 */
export async function getPayment(vipps, reference) {
  return sendRequest(vipps, 'GET', `/${reference}`)
}

/**
 * Captures a previously authorized payment.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @param {CapturePaymentRequest} body - The capture request body.
 * @returns {Promise<AdjustmentResponse>} The capture response.
 */
export async function capturePayment(vipps, reference, body) {
  return sendRequest(vipps, 'POST', `/${reference}/capture`, body, reference)
}

/**
 * Cancels an authorized payment that hasn't been captured yet.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @returns {Promise<AdjustmentResponse>} The cancel response.
 */
export async function cancelPayment(vipps, reference) {
  return sendRequest(vipps, 'POST', `/${reference}/cancel`, {}, reference)
}

/**
 * Refunds a previously captured payment.
 *
 * @param {import('./vipps.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @param {RefundPaymentRequest} body - The refund request body.
 * @returns {Promise<AdjustmentResponse>} The refund response.
 */
export async function refundPayment(vipps, reference, body) {
  return sendRequest(vipps, 'POST', `/${reference}/refund`, body, reference)
}
