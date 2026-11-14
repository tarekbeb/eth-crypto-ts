import { decompress, stripHexPrefix } from './utils';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex } from 'ethereum-cryptography/utils';

/**
 * Derives the uncompressed public key from a private key.
 * @param {string} privateKey - Hex, with or without `0x`.
 * @returns {string} 128 hex chars: no `0x`, no `04` prefix.
 */

export const publicKeyByPrivateKey = (privateKey: string) => {
  const key = stripHexPrefix(privateKey);
  const compressedPub = secp256k1.getPublicKey(key); // defaults to compressed format
  const point = secp256k1.ProjectivePoint.fromHex(compressedPub); // decompress the pub into an EC point
  return decompress(bytesToHex(point.toRawBytes(false))); // Get uncompressed SEC1 format pub
};
