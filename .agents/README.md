# Agent notes

Only what the code doesn't say. Read `call-map.md` for dependencies.

## Coding conventions

- Never put ticket/issue/PR numbers in comments. Keep comments neutral.
- Comments are brief: say what is non-obvious, nothing more. No narration of the code.
- TSDocs: one-line summary plus only the params/returns/throws that need format detail.

## Gotchas

- **Public entry is `src/index.ts`** (rollup input). `lib/index.ts` (default export / `hash` object) is NOT imported by it, so it is not published.
- **Not exported from the entry:** `encryptWithPublicKey`, `recoverPublicKey`. Exporting them is an API change; ask first.
- `SIGN_PREFIX`, `MIN_ENTROPY_SIZE` in `constants/` are unused.
- **Key formats differ per function** (no normalisation layer):
  - `createIdentity().privateKey` has `0x`; `.publicKey` has no `0x` and no `04` (README claims `0x`, it's wrong).
  - `publicKeyByPrivateKey`/`recoverPublicKey` return 128-hex-char keys (no `04`, no `0x`).
  - `encrypt` (low-level) wants `04`-prefixed hex; `encryptWithPublicKey` adds the `04` itself.
- `decompress` does NOT decompress compressed (02/03) keys. It only: if 64 bytes, prepend `04`; then always drops the first 2 hex chars. Passing a 33-byte key yields garbage.
- `keccak256` hashes the UTF-8 bytes of the input string (not hex-decoded bytes), despite the `solidityPacked` naming.
- `sign` only accepts 32-byte `0x` hash hex; returns `r||s||v` with v = `1b`/`1c` (27/28). `recoverPublicKey` treats any v other than `1c` as recovery 0.
- `hmacSha256Sign` lives in `sign.ts` but is used by ECIES in `encryption-utils.ts`.
- ECIES scheme is eccrypto-compatible (secp256k1 ECDH -> sha512 -> enc key | mac key, AES-256-CBC, HMAC-SHA256 over `iv||ephemPub||ciphertext`). Don't change without breaking interop with `eth-crypto`.
- `decrypt` wraps ECDH failure as an "Invalid MAC" error on purpose (don't leak which step failed). MAC compare must stay constant-time.
- `encrypt`'s `ephemPrivateKey` option exists for deterministic tests only.
- `createPrivateKey(entropy)` rejects short/repetitive/low-Shannon-entropy input; without entropy it mixes `randomBytes` through nested keccak.
- `utf8ToBytes` is hand-rolled to avoid `TextEncoder` (unavailable in React Native). Keep the no-polyfill goal: don't introduce Node built-ins (`Buffer`, `crypto`).

## Commands

`npm test` (jest + coverage), `npm run lint`, `npm run build`. Tests are in `src/tests/*.spec.ts`.
