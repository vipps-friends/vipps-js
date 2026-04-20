import assert from 'node:assert'
import { describe, test } from 'node:test'
import { getAccessToken, initializeVipps } from './index.js'

const config = {
  clientId: process.env.VIPPS_CLIENT_ID || '',
  clientSecret: process.env.VIPPS_CLIENT_SECRET || '',
  merchantSerialNumber: process.env.VIPPS_MSN || '',
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY || '',
  useTest: true,
}

describe('Token', () => {
  test('should fetch an access token', async () => {
    const vipps = initializeVipps(config)
    const token = await getAccessToken(vipps)

    assert.ok(token, 'Token should be defined')
    assert.strictEqual(typeof token, 'string', 'Token should be a string')
    assert.ok(token.length > 0, 'Token should not be empty')
    assert.strictEqual(vipps.token, token, 'Token should be cached in the instance')
  })

  test('should use getToken hook if provided', async () => {
    const customToken = 'external-token-123'
    const vipps = {
      ...config,
      baseUrl: 'https://apitest.vipps.no',
      getToken: async () => customToken,
    }

    const token = await getAccessToken(vipps)
    assert.strictEqual(token, customToken)
  })

  test('should call setToken hook if provided', async () => {
    let capturedToken = null
    const vipps = {
      ...config,
      baseUrl: 'https://apitest.vipps.no',
      setToken: async ({ access_token }) => {
        capturedToken = access_token
      },
    }

    const token = await getAccessToken(vipps)
    assert.strictEqual(capturedToken, token)
  })

  test('should return cached token if not expired', async () => {
    const vipps = {
      ...config,
      expiresOn: Date.now() + 120000,
      token: 'cached-token',
    }

    const token = await getAccessToken(vipps)
    assert.strictEqual(token, 'cached-token')
  })
})
