import { decompress, stripHexPrefix } from './utils';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { bytesToHex } from 'ethereum-cryptography/utils';

/**
 * Generate publicKey from the privateKey.
 * This creates the uncompressed publicKey,
 * where 04 has stripped from left
 * @returns {string}
 */

export const publicKeyByPrivateKey = (privateKey: string) => {
  const key = stripHexPrefix(privateKey);
  const compressedPub = secp256k1.getPublicKey(key); // defaults to compressed format
  const point = secp256k1.ProjectivePoint.fromHex(compressedPub); // decompress the pub into an EC point
  return decompress(bytesToHex(point.toRawBytes(false))); // Get uncompressed SEC1 format pub
};
