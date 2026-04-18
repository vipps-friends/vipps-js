# Project Mandates (vipps-js)

This file takes absolute precedence over general defaults.

## Architectural Principles
- **Cross-Platform Compatibility**: The library MUST run on Node.js, Deno, Bun, Cloudflare Workers, and Firebase Functions.
- **Native Primitives**: Use native `fetch` and `crypto.subtle` exclusively. DO NOT use Node.js-specific modules (e.g., `crypto`, `http`, `buffer`).
- **JSDoc over TypeScript**: The source code MUST be written in plain JavaScript with comprehensive JSDoc. TypeScript types MUST be bundled into a single `types.d.ts` file generated from these JSDoc comments.
- **1-to-1 Mapping**: Maintain a strict 1-to-1 mapping between the Vipps MobilePay API structure and library methods.
- **Documentation Fidelity**: Always copy parameter descriptions directly from the official Vipps MobilePay API documentation into the JSDoc.

## Technical Standards
- **Authentication**: Implement a `VippsAuth` class for automatic token lifecycle management. Support optional `getToken` and `setToken` hooks for external storage (e.g., Redis).
- **Webhooks**: Use `crypto.subtle` for HMAC verification to maintain cross-platform support.
- **Error Handling**: Do not create a custom `VippsError` class. Let native errors bubble up, but ensure that for HTTP errors, the response body from Vipps is attached or available for debugging.
- **Idempotency**: Automate `Idempotency-Key` generation (UUID) for all write operations unless explicitly provided by the user.
- **Comments**: ONLY JSDoc comments (`/** ... */`) are allowed. All other comments (e.g., `//`, `/* ... */`) must be removed or converted to JSDoc if they provide public API value.

## Testing & Validation
- **Integration Tests**: Primary validation must be performed against the real Vipps Merchant Test (MT) environment.
- **Reproduction**: Bug fixes must be preceded by a reproduction script or test case using the MT environment or a high-fidelity mock.
