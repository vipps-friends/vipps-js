import { ok, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import { verifyWebhook } from './index.js'

describe('Webhooks', () => {
  const secret = 'test-secret'
  const rawBody = '{"event":"test"}'

  test('should verify a valid webhook signature', async () => {
    const headers = {
      host: 'example.com',
      'x-ms-content-sha256': 'LZyVp7AtNPzZN1VVVZcO8Bg0g5RtUmj7z2ijJGdL5wg=',
      'x-ms-date': '2026-04-21T06:31:49.951Z',
      'x-ms-signature': 'n5UZNK1kFzZ7z2DLQQ5Za/mh9J/7djcjznVpPuFKmUE=',
    }

    const isValid = await verifyWebhook(rawBody, headers, secret)
    ok(isValid, 'Signature not valid')
  })

  test('should fail with invalid signature', async () => {
    const headers = {
      host: 'example.com',
      'x-ms-content-sha256': 'invalid',
      'x-ms-date': '2026-04-21T06:31:49.951Z',
      'x-ms-signature': 'invalid',
    }
    const isValid = await verifyWebhook(rawBody, headers, secret)
    strictEqual(isValid, false)
  })

  test('should fail if content is tampered', async () => {
    const headers = {
      host: 'example.com',
      'x-ms-content-sha256': 'LZyVp7AtNPzZN1VVVZcO8Bg0g5RtUmj7z2ijJGdL5wg=',
      'x-ms-date': '2026-04-21T06:31:49.951Z',
      'x-ms-signature': 'n5UZNK1kFzZ7z2DLQQ5Za/mh9J/7djcjznVpPuFKmUE=',
    }
    const isValid = await verifyWebhook(`${rawBody}tampered`, headers, secret)
    strictEqual(isValid, false)
  })
})
