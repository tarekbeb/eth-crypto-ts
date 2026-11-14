import { decompress } from './utils';
import { encrypt } from './encryption-utils';
import { EncryptionOptions } from './types';

/**
 * Encrypts a message for a public key using ECIES.
 * @param {string} publicKey - Uncompressed key as hex, without `0x`; `04` prefix optional.
 * @param {string} message - Plaintext.
 * @param {EncryptionOptions} [options] - `ephemPrivateKey` fixes the ephemeral key (tests only).
 * @returns {Encrypted} Hex-encoded `{ iv, ephemPublicKey, ciphertext, mac }`.
 */
export const encryptWithPublicKey = (publicKey: string, message: string, options?: EncryptionOptions) => {
  // ensure its an uncompressed publicKey
  const decompressedKey = decompress(publicKey);

  // re-add the compression-flag
  const pubString = '04' + decompressedKey;
  return encrypt(pubString, message, options);
};
