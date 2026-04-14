import { getAccessToken } from './auth.js';
import { generateUUID } from './utils.js';

/**
 * Internal helper to send a request to the ePayment API.
 * 
 * @param {import('./types.js').VippsInstance} vipps 
 * @param {string} method 
 * @param {string} path 
 * @param {Object} [body] 
 * @param {string} [idempotencyKey] 
 * @returns {Promise<any>}
 */
async function sendRequest(vipps, method, path, body, idempotencyKey) {
  const token = await getAccessToken(vipps);
  const baseUrl = vipps.config.useTestMode 
    ? 'https://apitest.vippsmobilepay.com' 
    : 'https://api.vippsmobilepay.com';
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Ocp-Apim-Subscription-Key': vipps.config.subscriptionKey,
    'Merchant-Serial-Number': vipps.config.merchantSerialNumber,
    'Content-Type': 'application/json',
  };

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  if (vipps.config.systemName) {
    headers['Vipps-System-Name'] = vipps.config.systemName;
  }
  if (vipps.config.systemVersion) {
    headers['Vipps-System-Version'] = vipps.config.systemVersion;
  }
  if (vipps.config.pluginName) {
    headers['Vipps-System-Plugin-Name'] = vipps.config.pluginName;
  }
  if (vipps.config.pluginVersion) {
    headers['Vipps-System-Plugin-Version'] = vipps.config.pluginVersion;
  }

  const response = await fetch(`${baseUrl}/epayment/v1/payments${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw { status: response.status, ...errorBody };
  }

  return response.json();
}

/**
 * Initiates a new payment session.
 * 
 * @param {import('./types.js').VippsInstance} vipps - The Vipps instance.
 * @param {import('./types.js').CreatePaymentRequest} body - The payment request body.
 * @returns {Promise<import('./types.js').PaymentResponse>} The payment response from Vipps.
 */
export async function createPayment(vipps, body) {
  const key = body.reference || generateUUID();
  return sendRequest(vipps, 'POST', '', body, key);
}

/**
 * Retrieves the current status and details of a payment.
 * 
 * @param {import('./types.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @returns {Promise<import('./types.js').PaymentDetails>} The current state of the payment.
 */
export async function getPayment(vipps, reference) {
  return sendRequest(vipps, 'GET', `/${reference}`);
}

/**
 * Captures a previously authorized payment.
 * 
 * @param {import('./types.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @param {import('./types.js').CapturePaymentRequest} body - The capture request body.
 * @returns {Promise<import('./types.js').AdjustmentResponse>} The capture response.
 */
export async function capturePayment(vipps, reference, body) {
  return sendRequest(vipps, 'POST', `/${reference}/capture`, body, reference);
}

/**
 * Cancels an authorized payment that hasn't been captured yet.
 * 
 * @param {import('./types.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @returns {Promise<import('./types.js').AdjustmentResponse>} The cancel response.
 */
export async function cancelPayment(vipps, reference) {
  return sendRequest(vipps, 'POST', `/${reference}/cancel`, {}, reference);
}

/**
 * Refunds a previously captured payment.
 * 
 * @param {import('./types.js').VippsInstance} vipps - The Vipps instance.
 * @param {string} reference - The unique identifier for the payment.
 * @param {import('./types.js').RefundPaymentRequest} body - The refund request body.
 * @returns {Promise<import('./types.js').AdjustmentResponse>} The refund response.
 */
export async function refundPayment(vipps, reference, body) {
  return sendRequest(vipps, 'POST', `/${reference}/refund`, body, reference);
}
