# Vipps JS Library Specification

## Project Overview
A modern, idiomatic JavaScript library for integrating with the Vipps MobilePay APIs.

## Goals
- **Developer Friendly**: Provide a clean, intuitive API for common payment tasks.
- **Type Safety**: Full TypeScript support via JSDoc; types generated for consumers.
- **Automated Auth**: Handle access token retrieval and renewal automatically.
- **Idempotency Support**: Easy management of idempotency keys for safe retries.
- **Unified Interface**: Support the new unified Vipps MobilePay platform (Norway, Denmark, Finland).

## Scope (Phase 1)
1. **Authentication**: Client credentials flow to obtain tokens.
2. **ePayment API**:
    - Create payment (One-time, Express).
    - Capture/Cancel/Refund payments.
    - Get payment status.
3. **Webhooks**: Utilities for verifying and handling incoming webhook events.

## Planned APIs (Future Phases)
- **Recurring API**: Subscription management.
- **Login API**: User identity and profile information.
- **Checkout API**: Integration with the hosted checkout solution.

## Technical Architecture
- **Language**: Javascript.
- **Runtime**: Node.js, Deno/Bun, Cloudflare Workers, Firebase Functions.
- **HTTP Client**: Native `fetch`.
- **Authentication**: Managing token lifecycle (caching and renewal). Optional `getToken` and `setToken` for external token management (e.g., Redis).
- **API Modules**: Separate modules for `ePayment`, `Recurring`, etc.
- **Plugin identification**: Set plugin name and version from `package.json`.
- **Fully typed**: Via JSDoc. Types are generated from JSDoc using `tsc` to produce `.d.ts` files.
- **1 to 1 mapping**: Between Vipps API structure and library methods.
- **Cross-platform Crypto**: Use `crypto.subtle` for webhook HMAC verification to ensure compatibility without the Node.js `crypto` module.
- **Documentation**: Copy descriptions from the Vipps MobilePay API documentation into JSDoc for all parameters.
- **tree shaking**: Ensure that the library is tree-shakeable. No classes. All functions should be standalone. Like Firebase v9 where first parameter is the config object. *initialize* function takes config object. getVipps() returns an instance of Vipps. All other functions take the instance as the first parameter. 

## Authentication Details
- **Base URL (Production)**: `https://api.vippsmobilepay.com`
- **Base URL (Test)**: `https://apitest.vippsmobilepay.com`
- **Token Endpoint**: `POST /accesstoken/get`
- **Headers**:
  - `client_id`
  - `client_secret`
  - `Ocp-Apim-Subscription-Key`

## ePayment API Details
- **Endpoints**:
  - `POST /epayment/v1/payments`: Create payment.
  - `GET /epayment/v1/payments/{reference}`: Get status.
  - `POST /epayment/v1/payments/{reference}/capture`: Capture payment.
  - `POST /epayment/v1/payments/{reference}/cancel`: Cancel payment.
  - `POST /epayment/v1/payments/{reference}/refund`: Refund payment.
- **Mandatory Headers**:
  - `Authorization: Bearer <token>`
  - `Ocp-Apim-Subscription-Key`
  - `Merchant-Serial-Number`
  - `Idempotency-Key` (Unique for every write operation)

## Tests
- Real tests against the Vipps Merchant Test (MT) environment.

## Project Structure
```text
vipps-js/
├── src/
│   ├── index.js          # Entry point
│   ├── client.js         # Main Vipps class
│   ├── auth.js           # Authentication logic
│   ├── epayment.js       # ePayment implementation
│   └── webhooks.js       # Webhook verification
├── tests/                # Integration tests
├── Spec.md               # This file
└── package.json
```

## Error Handling
- No custom Error class.
- The library will throw if the response is not `ok` (status >= 400).
- The error object should ideally contain the JSON body from Vipps (error code, message).

## Idempotency
- Users can provide their own `Idempotency-Key`.
- If not provided, the library will generate a UUID by default for write operations.
- Provide a helper function to generate a UUID (e.g., prefixed with `system-name-`).

## Client Configuration
```javascript
/**
 * @typedef {Object} VippsConfig
 * @property {string} clientId
 * @property {string} clientSecret
 * @property {string} subscriptionKey
 * @property {string} merchantSerialNumber
 * @property {boolean} [useTestMode=false]
 * @property {string} [systemName]
 * @property {string} [systemVersion]
 * @property {Function} [getToken] - Optional external token getter
 * @property {Function} [setToken] - Optional external token setter
 */
```

## Proposed Initial Usage
```javascript
import { Vipps } from 'vipps-js';

const vipps = new Vipps({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  subscriptionKey: 'your-subscription-key',
  merchantSerialNumber: 'your-merchant-serial-number',
  useTestMode: true,
});

// Create a payment
const payment = await vipps.ePayment.create({
  amount: { value: 10000, currency: 'NOK' },
  paymentMethod: { type: 'WALLET' },
  customer: { phoneNumber: '4791234567' },
  reference: 'order-123',
  userFlow: 'WEB_REDIRECT',
  returnUrl: 'https://example.com/callback',
  paymentDescription: 'One pair of socks',
});
```

## Webhooks
The library will provide a `Webhooks` module to verify incoming notifications.

### Verification Logic
1. **Integrity Check**: Compare `x-ms-content-sha256` header with Base64(SHA256(rawBody)).
2. **Signature Check**: Verify HMAC-SHA256 signature using `crypto.subtle.verify`.
    - String to sign: `{x-ms-date}\n{host}\n{x-ms-content-sha256}`.
    - Key: Webhook secret.
