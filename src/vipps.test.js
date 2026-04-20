import { ok, strictEqual } from 'node:assert'
import { describe, test } from 'node:test'
import { getVipps, initializeVipps } from './index.js'

describe('Vipps Initialization', () => {
  test('should return the same instance if initialized twice', () => {
    const config = {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      merchantSerialNumber: '123456',
      subscriptionKey: 'test-sub-key',
    }

    const first = initializeVipps(config)
    const second = initializeVipps({ ...config, clientId: 'other' })
    const third = getVipps()

    ok(first === second, 'Should return existing instance')
    ok(first === third, 'getVipps should return initialized instance')
  })
})
