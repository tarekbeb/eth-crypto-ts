import { stripHexPrefix } from './utils';
import { decrypt } from './encryption-utils';
import { Encrypted } from './types';

/**
 * Decrypts an ECIES payload produced by `encryptWithPublicKey` (or eth-crypto/eccrypto).
 * @param {string} privateKey - Recipient private key, with or without `0x`.
 * @param {Encrypted} encrypted - Hex-encoded `{ iv, ephemPublicKey, ciphertext, mac }`.
 * @returns {string} The UTF-8 plaintext.
 * @throws if the MAC check fails or the payload is malformed.
 */
export const decryptWithPrivateKey = (privateKey: string, encrypted: Encrypted) => {
  // remove '0x' from privateKey
  const twoStripped = stripHexPrefix(privateKey);

  return decrypt(twoStripped, encrypted);
};
