# @vipps-friends/vipps-js

[![Build Status](https://github.com/vipps-friends/vipps-js/actions/workflows/test.yml/badge.svg)](https://github.com/vipps-friends/vipps-js/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/vipps-friends/vipps-js/actions/workflows/test.yml)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@vipps-friends/vipps-js)](https://bundlephobia.com/package/@vipps-friends/vipps-js)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)](https://npmgraph.js.org/?q=%40vipps-friends%2Fvipps-js)

A modern, functional, and tree-shakeable JavaScript library for integrating with the **Vipps MobilePay ePayment API v1**.

> **⚠️ Disclaimer**: This is **not** an official Vipps MobilePay package. It is maintained by the community.

## Features

- **Cross-Platform**: Works in Node.js, Deno, Bun, Cloudflare Workers, and Firebase Functions.
- **Native Primitives**: Uses native `fetch` and `crypto.subtle` exclusively.
- **Tree-shakeable**: Functional API design (similar to Firebase v9) ensures you only bundle what you use.
- **Fully Typed**: Written in plain JavaScript with comprehensive JSDoc; TypeScript declarations are included.
- **Automated Auth**: Handles access token retrieval and caching automatically.

## Installation

```bash
npm install @vipps-friends/vipps-js
```

## Quick Start

### 1. Initialize the client

```javascript
import { initializeVipps } from '@vipps-friends/vipps-js'

initializeVipps({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  subscriptionKey: 'your-subscription-key',
  merchantSerialNumber: 'your-msn',
  useTest: true, // Set to false for production
})
```

### 2. Create a Payment

```javascript
import { createPayment, getVipps } from '@vipps-friends/vipps-js'

const payment = await createPayment(getVipps(), {
  amount: {
    value: 1000, // 10.00 NOK
    currency: 'NOK',
  },
  reference: 'order-12345',
  paymentMethod: {
    type: 'WALLET',
  },
  userFlow: 'WEB_REDIRECT',
  returnUrl: 'https://your-store.com/callback',
  paymentDescription: 'One pair of cozy socks',
})

console.log('Redirect the user here:', payment.redirectUrl)
```

### 3. Get Payment Status

```javascript
import { getPayment, getVipps } from '@vipps-friends/vipps-js'

const details = await getPayment(getVipps(), 'order-12345')

if (details.state === 'AUTHORIZED') {
  console.log('Payment is authorized!')
}
```

## API Support

Currently, this library focuses on the **ePayment API v1**. 

If you need support for other Vipps MobilePay APIs (Recurring, Login, Checkout, etc.), we highly encourage you to:
1.  **Open an Issue**: Let us know which endpoints you need.
2.  **Submit a PR**: Contributions are very welcome! We follow a 1-to-1 mapping with the official OpenAPI specifications.

## For Vipps MobilePay Developers

If you work at Vipps MobilePay and would like to get in touch regarding the direction of this library, or if you'd like to see it become an official package, please feel free to reach out via GitHub issues or directly to the contributors.

## Commercial Support

Need help with integration, custom features, or priority support? We offer paid consulting and support services to help you get the most out of your Vipps MobilePay integration. Open an issue or reach out to the maintainers.

## License

MIT
