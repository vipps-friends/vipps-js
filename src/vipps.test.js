import { ok } from 'node:assert'
import { describe, test } from 'node:test'
import { getVipps, initializeVipps } from './index.js'

describe('Vipps', () => {
  test('should return the same instance', () => {
    const config = {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      merchantSerialNumber: '123456',
      subscriptionKey: 'test-sub-key',
    }

    const first = initializeVipps(config)
    const second = getVipps()

    ok(first === second, 'Should return existing instance')
  })
})
