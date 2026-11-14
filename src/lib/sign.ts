import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha2';
import { hexToBytes } from 'ethereum-cryptography/utils';
import { addLeading0x, isHexString, stripHexPrefix } from './utils';

/**
 * Signs a 32-byte hash (does not hash the input).
 * @param  {string} privateKey - Hex, with or without `0x`.
 * @param  {string} hash - 32-byte hex, with or without `0x`.
 * @return {string} `0x` + r||s (compact) + v (`1b` or `1c`).
 * @throws if `hash` is not 32 bytes of hex.
 */
export const sign = (privateKey: string, hash: string) => {
  const hashWith0x = addLeading0x(hash);
  if (hashWith0x.length !== 66 || !isHexString(hashWith0x)) throw new Error('Can only sign hashes, given: ' + hash);

  const sigObj = secp256k1.sign(hexToBytes(stripHexPrefix(hash)), hexToBytes(stripHexPrefix(privateKey)));

  const recoveryId = sigObj.recovery === 1 ? '1c' : '1b';
  const newSignature = '0x' + sigObj.toCompactHex() + recoveryId;
  return newSignature;
};

/**
 * HMAC-SHA256.
 * @param {Uint8Array} key - MAC key.
 * @param {Uint8Array} msg - Data to authenticate.
 * @returns {Uint8Array} 32-byte MAC.
 */
export const hmacSha256Sign = (key: Uint8Array, msg: Uint8Array) => {
  const result = hmac(sha256, key, msg);
  return result;
};
