import { test, describe } from 'node:test';
import assert from 'node:assert';
import { initializeVipps, getAccessToken } from './index.js';

const config = {
  clientId: process.env.VIPPS_CLIENT_ID,
  clientSecret: process.env.VIPPS_CLIENT_SECRET,
  subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY,
  merchantSerialNumber: process.env.VIPPS_MSN,
  useTestMode: true,
};

describe('Vipps Integration Tests', () => {
  const vipps = initializeVipps(config);

  test('should fetch an access token from Vipps MT environment', async () => {
    const token = await getAccessToken(vipps);
    
    assert.ok(token, 'Token should be defined');
    assert.strictEqual(typeof token, 'string', 'Token should be a string');
    assert.ok(token.length > 0, 'Token should not be empty');
    
    // Verify that the token is cached
    assert.strictEqual(vipps._auth.token, token, 'Token should be cached in the instance');
  });
});
