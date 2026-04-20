import { ok, partialDeepStrictEqual, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import {
  cancelPayment,
  capturePayment,
  createPayment,
  forceApprove,
  getPayment,
  initializeVipps,
  refundPayment,
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

describe('ePayment', () => {
  const vipps = initializeVipps(config)

  test('should create, get and cancel a payment', async () => {
    const reference = `test-cancel-${Date.now()}`
    const createResponse = await createPayment(vipps, {
      amount: {
        currency: 'NOK',
        value: 1000,
      },
      customer: {
        phoneNumber: '4740000000',
      },
      metadata: {
        testKey: 'testValue',
      },
      paymentDescription: 'Integration test payment cancel',
      paymentMethod: {
        type: 'WALLET',
      },
      reference,
      returnUrl: 'https://example.com/redirect',
      userFlow: 'WEB_REDIRECT',
    })
    strictEqual(createResponse.reference, reference)
    ok(createResponse.redirectUrl, 'Should have a redirectUrl')

    const details = await getPayment(vipps, reference)
    strictEqual(details.reference, reference)
    strictEqual(details.state, 'CREATED')

    const cancelResponse = await cancelPayment(vipps, reference)
    ok(cancelResponse.aggregate, 'Should return aggregate in response')

    const cancelledDetails = await getPayment(vipps, reference)
    strictEqual(cancelledDetails.state, 'TERMINATED', 'Payment should be TERMINATED after cancel')
  })
})
