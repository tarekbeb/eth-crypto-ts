import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils.js';
import { keccak256 as _keccak256 } from 'ethereum-cryptography/keccak.js';
import { addLeading0x, utf8ToBytes } from './utils';

/** Keccak-256 of the UTF-8 bytes of `value`; returns `0x`-prefixed hex. */
const solidityPackedKeccak256 = (value: string) => {
  const bytes = utf8ToBytes(value);
  const hex = addLeading0x(bytesToHex(bytes));
  const hash = _keccak256(hexToBytes(hex));
  return addLeading0x(bytesToHex(hash));
};

/**
 * Keccak-256 of a string's UTF-8 bytes (input is NOT hex-decoded).
 * @param {string} params - Text to hash.
 * @returns {string} `0x`-prefixed 32-byte hex digest.
 */
export const keccak256 = (params: string) => {
  return solidityPackedKeccak256(params);
};
