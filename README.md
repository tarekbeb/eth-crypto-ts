# eth-crypto-ts

[![npm version](https://badge.fury.io/js/eth-crypto-ts.svg)](https://badge.fury.io/js/eth-crypto-ts)

A **lightweight, TypeScript-first** cryptography library for Ethereum. Built as an improvement over the original `eth-crypto`, with a curated subset of functions and **zero Node.js polyfill requirements**.

## Why eth-crypto-ts?

- **Lightweight** — Uses [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) instead of heavy alternatives, significantly reducing bundle size
- **No polyfills** — Works seamlessly in browsers, React Native, and Node.js without requiring crypto or other Node.js native module polyfills
- **TypeScript-first** — Fully typed, built with modern TypeScript
- **Focused API** — Exports only the essential crypto functions needed for Ethereum applications

## Installation

```bash
npm install eth-crypto-ts
```

## API

### `createIdentity()`

Creates a new Ethereum identity (private key + public key).

```typescript
import { createIdentity } from 'eth-crypto-ts';

const identity = createIdentity();
// { privateKey: '0x...', publicKey: '0x...' }
```

### `sign(privateKey, message)`

Sign a message with a private key.

```typescript
import { sign } from 'eth-crypto-ts';

const signature = sign(privateKey, messageHash);
```

### `encryptWithPublicKey(publicKey, message)`

Encrypt data with a public key using ECIES.

```typescript
import { encryptWithPublicKey } from 'eth-crypto-ts';

const encrypted = encryptWithPublicKey(publicKey, 'secret message');
// { iv, ephemPublicKey, ciphertext, mac }
```

### `decryptWithPrivateKey(privateKey, encrypted)`

Decrypt ECIES-encrypted data with a private key.

```typescript
import { decryptWithPrivateKey } from 'eth-crypto-ts';

const message = decryptWithPrivateKey(privateKey, encrypted);
```

### `publicKeyByPrivateKey(privateKey)`

Derive the public key from a private key.

```typescript
import { publicKeyByPrivateKey } from 'eth-crypto-ts';

const publicKey = publicKeyByPrivateKey(privateKey);
```

### `recoverPublicKey(messageHash, signature)`

Recover the public key from a message and its signature.

```typescript
import { recoverPublicKey } from 'eth-crypto-ts';

const publicKey = recoverPublicKey(messageHash, signature);
```

### `keccak256(data)`

Compute the Keccak-256 hash.

```typescript
import { keccak256 } from 'eth-crypto-ts';

const hash = keccak256('0x' + Buffer.from('data').toString('hex'));
```

Or use the namespaced version:

```typescript
import { hash } from 'eth-crypto-ts';

const h = hash.keccak256('0x...');
```

## Notes

- This library is a **curated subset** of the original `eth-crypto`, focusing on the most commonly needed functions
- Ideal for applications where bundle size and environment compatibility matter

## License

ISC
