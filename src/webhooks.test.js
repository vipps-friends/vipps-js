import { ok, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import { verifyWebhook } from './index.js'

describe('Webhooks', () => {
  const secret = 'test-secret'
  const rawBody = JSON.stringify({ event: 'test' })
  const date = new Date().toISOString()
  const host = 'example.com'

  test('should verify a valid webhook signature', async () => {
    const encoder = new TextEncoder()
    const data = encoder.encode(rawBody)

    // 1. Calculate SHA-256 hash of body (Base64)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const contentSha256 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))

    // 2. Calculate signature
    const stringToSign = `${date}\n${host}\n${contentSha256}`
    const stringToSignBuffer = encoder.encode(stringToSign)
    const keyBuffer = encoder.encode(secret)
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { hash: 'SHA-256', name: 'HMAC' },
      false,
      ['sign'],
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, stringToSignBuffer)
    const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))

    const headers = {
      host,
      'x-ms-content-sha256': contentSha256,
      'x-ms-date': date,
      'x-ms-signature': signature,
    }

    const isValid = await verifyWebhook(rawBody, headers, secret)
    ok(isValid, 'Webhook should be valid')
  })

  test('should fail with invalid signature', async () => {
    const headers = {
      host,
      'x-ms-content-sha256': 'invalid',
      'x-ms-date': date,
      'x-ms-signature': 'invalid',
    }
    const isValid = await verifyWebhook(rawBody, headers, secret)
    strictEqual(isValid, false, 'Should be invalid')
  })

  test('should fail if headers are missing', async () => {
    const isValid = await verifyWebhook(rawBody, {}, secret)
    strictEqual(isValid, false)
  })
})
