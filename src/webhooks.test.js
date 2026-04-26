//@ts-check

import { ok, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import {
  deleteWebhook,
  getWebhooks,
  initializeVipps,
  registerWebhook,
  verifyWebhook,
} from './index.js'

const config = {
  clientId: process.env.VIPPS_CLIENT_ID || '',
  clientSecret: process.env.VIPPS_CLIENT_SECRET || '',
  merchantSerialNumber: process.env.VIPPS_MSN || '',
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY || '',
  systemName: 'vipps-js-test',
  systemVersion: '1.0.0',
  useTest: true,
}

describe('Webhooks', () => {
  describe('verifyWebhook', () => {
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

  describe('Integration API', () => {
    const vipps = initializeVipps(config)

    test('should manage webhook lifecycle', async () => {
      const initial = await getWebhooks(vipps)
      for (const w of initial.webhooks) {
        await deleteWebhook(vipps, w.id)
      }

      const events = ['epayments.payment.created.v1']
      const ts = Date.now()
      const w1 = await registerWebhook(vipps, {
        events,
        url: `https://vipps.no/webhook-1-${ts}`,
      })
      const w2 = await registerWebhook(vipps, {
        events,
        url: `https://vipps.no/webhook-2-${ts}`,
      })
      const w3 = await registerWebhook(vipps, {
        events,
        url: `https://vipps.no/webhook-3-${ts}`,
      })

      ok(w1.id && w1.secret)
      ok(w2.id && w2.secret)
      ok(w3.id && w3.secret)

      await deleteWebhook(vipps, w1.id)

      const mid = await getWebhooks(vipps)
      strictEqual(mid.webhooks.length, 2, 'Should have 2 webhooks remaining')

      const urls = mid.webhooks.map((w) => w.url)
      ok(!urls.includes(`https://vipps.no/webhook-1-${ts}`))
      ok(urls.includes(`https://vipps.no/webhook-2-${ts}`))
      ok(urls.includes(`https://vipps.no/webhook-3-${ts}`))

      for (const w of mid.webhooks) {
        await deleteWebhook(vipps, w.id)
      }

      const final = await getWebhooks(vipps)
      strictEqual(final.webhooks.length, 0, 'Should have 0 webhooks at the end')
    })
  })
})
