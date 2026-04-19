import assert from 'node:assert'
import { describe, test } from 'node:test'
import { cancelPayment, createPayment, getPayment, initializeVipps } from './index.js'

const config = {
  clientId: process.env.VIPPS_CLIENT_ID || '',
  clientSecret: process.env.VIPPS_CLIENT_SECRET || '',
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY || '',
  merchantSerialNumber: process.env.VIPPS_MSN || '',
  useTest: true,
}

describe('ePayment Integration Tests', () => {
  const vipps = initializeVipps(config)
  const reference = `test-${Date.now()}`

  test('should create, get and cancel a payment', async () => {
    const paymentRequest = {
      amount: {
        value: 1000,
        currency: 'NOK',
      },
      reference,
      paymentMethod: {
        type: 'WALLET',
      },
      userFlow: 'WEB_REDIRECT',
      returnUrl: 'https://example.com/redirect',
      paymentDescription: 'Integration test payment',
      metadata: {
        testKey: 'testValue',
      },
    }

    const createResponse = await createPayment(vipps, paymentRequest)
    assert.strictEqual(createResponse.reference, reference)
    assert.ok(createResponse.redirectUrl, 'Should have a redirectUrl')

    const details = await getPayment(vipps, reference)
    assert.strictEqual(details.reference, reference)
    assert.strictEqual(details.state, 'CREATED')
    assert.strictEqual(details.amount.value, 1000)
    assert.strictEqual(details.amount.currency, 'NOK')
    assert.strictEqual(details.paymentMethod.type, 'WALLET')

    const cancelResponse = await cancelPayment(vipps, reference)
    assert.ok(cancelResponse.aggregate, 'Should return aggregate in response')

    const cancelledDetails = await getPayment(vipps, reference)
    assert.strictEqual(
      cancelledDetails.state,
      'TERMINATED',
      'Payment should be TERMINATED after cancel',
    )
  })
})
