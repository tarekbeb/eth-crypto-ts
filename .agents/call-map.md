# Call map

`A -> B` = A calls B. Leaf helpers in `lib/utils.ts` are used everywhere.

## Public entry (`src/index.ts`) exports
`constants`, `keccak256`, `sign` (+`hmacSha256Sign`), `decryptWithPrivateKey`, `createIdentity` (+`createPrivateKey`), `publicKeyByPrivateKey`

## Graph

```
createIdentity
 ├─> createPrivateKey ─> keccak256 (ethereum-cryptography), addLeading0x, concatUint8Arrays
 ├─> publicKeyByPrivateKey ─> stripHexPrefix, secp256k1.getPublicKey, decompress
 └─> stripHexPrefix

encryptWithPublicKey            (not exported from entry)
 ├─> decompress
 └─> encrypt (encryption-utils)
      ├─> secp256k1 ECDH, sha512, aesEncrypt
      ├─> utf8ToBytes, concatUint8Arrays
      └─> hmacSha256Sign (sign.ts)

decryptWithPrivateKey
 ├─> stripHexPrefix
 └─> decrypt (encryption-utils)
      ├─> secp256k1 ECDH, sha512, aesDecrypt
      ├─> concatUint8Arrays
      ├─> hmacSha256Sign (sign.ts)
      └─> constantTimeEqual

sign ─> addLeading0x, isHexString, stripHexPrefix, secp256k1.sign
recoverPublicKey (not exported) ─> stripHexPrefix, ecdsaRecover
keccak256 (hash.ts) ─> solidityPackedKeccak256 ─> utf8ToBytes, addLeading0x
```

## utils.ts leaves
`isHexPrefixed` <- `stripHexPrefix`; `isHexString`, `addLeading0x`, `decompress`, `concatUint8Arrays`, `utf8ToBytes` have no internal deps.

## Dependency direction
`utils` <- `sign`, `hash`, `public-key-by-private-key` <- `create-identity`
`sign.hmacSha256Sign` <- `encryption-utils` <- `encrypt-with-public-key`, `decrypt-with-private-key`
