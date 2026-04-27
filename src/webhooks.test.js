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
    const request = {
      body: '{"some-unique-content":"ee6e441b-cc4a-46f8-895d-a5af79bcc233/hello-world"}',
      headers: {
        authorization:
          'HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=u4zz3dyO3c3xJwl36rPpn1n7WF75u6r2epjH70MZTGM=',
        host: 'webhook.site',
        'x-ms-content-sha256': 'lNlsp1XA03N34HrQsVzPgJKtC+r7l/RBF4V3JQUWMj4=',
        'x-ms-date': 'Thu, 30 Mar 2023 08:38:32 GMT',
      },
      method: 'POST',
      path: '/e2cee29b-012e-4f1d-8ef4-e95fd74a7a63',
      secret:
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    }

    test('should verify a valid webhook signature', async () => {
      const isValid = await verifyWebhook(request)
      ok(isValid, 'Signature should be valid')
    })

    test('should fail to verify an invalid webhook signature', async () => {
      const isValid = await verifyWebhook({ ...request, body: `modified${request.body}` })
      ok(!isValid, 'Signature should be invalid')
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
