// @ts-check

/**
 * Internal helper to send a request to the Vipps MobilePay API.
 *
 * @param {import('./vipps.js').VippsInstance} vipps
 * @param {string} method
 * @param {string} url
 * @param {Object} [options]
 * @param {Record<string, string>} [options.headers]
 * @param {Object} [options.body]
 * @returns {Promise<any>}
 */
export async function request(vipps, method, url, { headers = {}, body } = {}) {
  const {
    subscriptionKey,
    merchantSerialNumber,
    systemName,
    systemVersion,
    pluginName,
    pluginVersion,
  } = vipps

  const finalHeaders = new Headers({
    'Merchant-Serial-Number': merchantSerialNumber,
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Vipps-System-Plugin-Name': pluginName,
    'Vipps-System-Plugin-Version': pluginVersion,
    ...headers,
  })

  if (systemName) {
    finalHeaders.set('Vipps-System-Name', systemName)
  }
  if (systemVersion) {
    finalHeaders.set('Vipps-System-Version', systemVersion)
  }

  if (body) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    body: body ? JSON.stringify(body) : undefined,
    headers: finalHeaders,
    method,
  })

  if (!response.ok) {
    const errorBody = await response.json()
    throw { status: response.status, url, ...errorBody }
  }
  const responseBody = await response.text()
  if (responseBody.length === 0) {
    return {}
  }
  return JSON.parse(responseBody)
}
