import { ok, partialDeepStrictEqual, rejects, strictEqual } from 'node:assert'
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
      amount: { currency: 'NOK', value: 1000 },
      customer: { phoneNumber: '4740000000' },
      metadata: { testKey: 'testValue' },
      paymentDescription: 'Integration test payment cancel',
      paymentMethod: { type: 'WALLET' },
      reference,
      returnUrl: 'https://example.com/redirect',
      userFlow: 'WEB_REDIRECT',
    })
    ok(createResponse.redirectUrl)
    strictEqual(createResponse.reference, reference)

    const details = await getPayment(vipps, reference)
    partialDeepStrictEqual(details, {
      aggregate: {
        authorizedAmount: { currency: 'NOK', value: 0 },
        cancelledAmount: { currency: 'NOK', value: 0 },
        capturedAmount: { currency: 'NOK', value: 0 },
        refundedAmount: { currency: 'NOK', value: 0 },
      },
      amount: { currency: 'NOK', value: 1000 },
      metadata: { testKey: 'testValue' },
      paymentMethod: { type: 'WALLET' },
      profile: {},
      reference,
      state: 'CREATED',
    })

    const cancelResponse = await cancelPayment(vipps, reference)
    partialDeepStrictEqual(cancelResponse, {
      aggregate: {
        authorizedAmount: { currency: 'NOK', value: 0 },
        cancelledAmount: { currency: 'NOK', value: 1000 },
        capturedAmount: { currency: 'NOK', value: 0 },
        refundedAmount: { currency: 'NOK', value: 0 },
      },
      amount: { currency: 'NOK', value: 1000 },
      reference,
      state: 'TERMINATED',
    })
  })

  test('should create, force approve, capture and refund a payment', async () => {
    const reference = `test-force-${Date.now()}`
    const createResponse = await createPayment(vipps, {
      amount: { currency: 'NOK', value: 1000 },
      paymentMethod: { type: 'WALLET' },
      reference,
      returnUrl: 'https://example.com/redirect',
      userFlow: 'WEB_REDIRECT',
    })
    strictEqual(createResponse.reference, reference)

    await forceApprove(vipps, reference, { customer: { phoneNumber: '4793313386' } })
    const approved = await getPayment(vipps, reference)
    partialDeepStrictEqual(approved, {
      aggregate: {
        authorizedAmount: { currency: 'NOK', value: 1000 },
        cancelledAmount: { currency: 'NOK', value: 0 },
        capturedAmount: { currency: 'NOK', value: 0 },
        refundedAmount: { currency: 'NOK', value: 0 },
      },
      amount: { currency: 'NOK', value: 1000 },
      paymentMethod: {
        cardBin: '429198',
        type: 'WALLET',
      },
      profile: {},
      reference,
      state: 'AUTHORIZED',
    })

    const captured = await capturePayment(vipps, reference, {
      modificationAmount: { currency: 'NOK', value: 1000 },
    })
    partialDeepStrictEqual(captured, {
      aggregate: {
        authorizedAmount: { currency: 'NOK', value: 1000 },
        cancelledAmount: { currency: 'NOK', value: 0 },
        capturedAmount: { currency: 'NOK', value: 1000 },
        refundedAmount: { currency: 'NOK', value: 0 },
      },
      amount: { currency: 'NOK', value: 1000 },
      reference,
      state: 'AUTHORIZED',
    })

    const refunded = await refundPayment(vipps, reference, {
      modificationAmount: { currency: 'NOK', value: 500 },
    })
    partialDeepStrictEqual(refunded, {
      aggregate: {
        authorizedAmount: { currency: 'NOK', value: 1000 },
        cancelledAmount: { currency: 'NOK', value: 0 },
        capturedAmount: { currency: 'NOK', value: 1000 },
        refundedAmount: { currency: 'NOK', value: 500 },
      },
      amount: { currency: 'NOK', value: 1000 },
      reference,
      state: 'AUTHORIZED',
    })
  })

  test('should fail for non-existent payment', async () => {
    const reference = `test-non-existent-${Date.now()}`
    await rejects(getPayment(vipps, reference))
  })
})
