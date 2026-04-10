import { getRandomBytesSync as randomBytes } from 'ethereum-cryptography/random.js';
import { addLeading0x, stripHexPrefix, concatUint8Arrays } from './utils';
import { publicKeyByPrivateKey } from './public-key-by-private-key';
import { bytesToHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

export const DEFAULT_ENTROPY_BYTES = 32;
export const MINIMUM_SHANNON_ENTROPY = 4;

/**
 * creates a new private key
 * @param { Uint8Array } entropy - optional entropy to create the private key
 * @returns a new private key
 */
export const createPrivateKey = (entropy?: Uint8Array) => {
  if (entropy) {
    if (!(entropy instanceof Uint8Array) || entropy.length < DEFAULT_ENTROPY_BYTES) {
      throw new Error(`entropy must be a Uint8Array of at least ${DEFAULT_ENTROPY_BYTES} bytes`);
    }

    // Check byte diversity
    const uniqueBytes = new Set(entropy);
    if (uniqueBytes.size < Math.min(8, entropy.length / 4)) {
      throw new Error(`entropy is too repetitive (only ${uniqueBytes.size} unique byte values)`);
    }

    // Estimate Shannon entropy
    const byteCounts = new Uint32Array(256);
    entropy.forEach((b) => byteCounts[b]++);
    const total = entropy.length;
    let shannonEntropy = 0;
    for (let i = 0; i < 256; i++) {
      if (byteCounts[i] > 0) {
        const p = byteCounts[i] / total;
        shannonEntropy -= p * Math.log2(p);
      }
    }
    if (shannonEntropy < MINIMUM_SHANNON_ENTROPY) {
      throw new Error(`entropy has low Shannon entropy (${shannonEntropy.toFixed(2)} bits/byte)`);
    }

    const outerHex = keccak256(entropy);
    return addLeading0x(bytesToHex(outerHex));
  } else {
    const innerHex = keccak256(concatUint8Arrays([randomBytes(32), randomBytes(32)]));
    const middleHex = concatUint8Arrays([concatUint8Arrays([randomBytes(32), innerHex]), randomBytes(32)]);
    const outerHex = keccak256(middleHex);
    return addLeading0x(bytesToHex(outerHex));
  }
};

/**
 * creates a new identity
 * @param { Uint8Array } entropy - optional entropy to create the private key
 * @returns a new pair of private and public key
 */
export const createIdentity = (entropy?: Uint8Array) => {
  const privateKey = createPrivateKey(entropy);

  const walletPublicKey = publicKeyByPrivateKey(privateKey);
  const identity = {
    privateKey: privateKey,
    publicKey: stripHexPrefix(walletPublicKey),
  };
  return identity;
};
