import { ok, partialDeepStrictEqual, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import { cancelPayment, createPayment, getPayment, initializeVipps } from './index.js'

const config = {
  clientId: process.env.VIPPS_CLIENT_ID || '',
  clientSecret: process.env.VIPPS_CLIENT_SECRET || '',
  merchantSerialNumber: process.env.VIPPS_MSN || '',
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY || '',
  useTest: true,
}

describe('ePayment Integration Tests', () => {
  const vipps = initializeVipps(config)
  const reference = `test-${Date.now()}`

  test('should create, get and cancel a payment', async () => {
    const createResponse = await createPayment(vipps, {
      amount: {
        currency: 'NOK',
        value: 1000,
      },
      customer: {
        phoneNumber: '4712345678',
      },
      metadata: {
        testKey: 'testValue',
      },
      paymentDescription: 'Integration test payment',
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
    partialDeepStrictEqual(details, {
      aggregate: {
        authorizedAmount: {
          currency: 'NOK',
          value: 0,
        },
        cancelledAmount: {
          currency: 'NOK',
          value: 0,
        },
        capturedAmount: {
          currency: 'NOK',
          value: 0,
        },
        refundedAmount: {
          currency: 'NOK',
          value: 0,
        },
      },
      amount: {
        currency: 'NOK',
        value: 1000,
      },
      metadata: {
        testKey: 'testValue',
      },
      paymentMethod: {
        type: 'WALLET',
      },
      profile: {},
      reference,
      state: 'CREATED',
    })

    const cancelResponse = await cancelPayment(vipps, reference)
    ok(cancelResponse.aggregate, 'Should return aggregate in response')

    const cancelledDetails = await getPayment(vipps, reference)
    strictEqual(cancelledDetails.state, 'TERMINATED', 'Payment should be TERMINATED after cancel')
  })
})
