import { sha512 } from 'ethereum-cryptography/sha512.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { getRandomBytesSync as randomBytes } from 'ethereum-cryptography/random.js';
import { hexToBytes, bytesToHex, bytesToUtf8 } from 'ethereum-cryptography/utils.js';
import { encrypt as aesEncrypt, decrypt as aesDecrypt } from 'ethereum-cryptography/aes.js';
import { Encrypted, EncryptionOptions } from './types';
import { hmacSha256Sign } from './sign';
import { concatUint8Arrays, utf8ToBytes } from './utils';

/**
 *  See https://github.com/bitchan/eccrypto for the original implementation that eth-crypto used, it's ancient and not maintained.
 */

/**
 * Encrypts a message using the recipient's public key.
 * @param {string} publicKeyTo - The recipient's public key.
 * @param {string} msg - The message to encrypt.
 * @returns {Encrypted} The encrypted message.
 */

export const encrypt = (publicKeyTo: string, msg: string, options?: EncryptionOptions): Encrypted => {
  const ephemPrivateKey = options?.ephemPrivateKey ? hexToBytes(options.ephemPrivateKey) : randomBytes(32);
  const iv = randomBytes(16);

  const compressedPub = secp256k1.getPublicKey(ephemPrivateKey); // defaults to compressed format
  const point = secp256k1.ProjectivePoint.fromHex(compressedPub); // decompress the pub into an EC point
  const ephemPublicKey = point.toRawBytes(false); // Get uncompressed SEC1 format pub
  const sharedSecret = secp256k1.getSharedSecret(ephemPrivateKey, hexToBytes(publicKeyTo), true).slice(1);
  const hash = sha512(sharedSecret);
  const encryptionKey = hash.subarray(0, 32);
  const macKey = hash.subarray(32);
  const message = utf8ToBytes(msg);
  const data = aesEncrypt(message, encryptionKey, iv, 'aes-256-cbc');
  const dataToMac = concatUint8Arrays([iv, ephemPublicKey, data]);
  const mac = hmacSha256Sign(macKey, dataToMac);

  return {
    iv: bytesToHex(iv),
    ephemPublicKey: bytesToHex(ephemPublicKey),
    ciphertext: bytesToHex(data),
    mac: bytesToHex(mac),
  };
};

/**
 * Decrypts an encrypted message using the recipient's private key.
 * @param {string} privateKey - The recipient's private key.
 * @param {Encrypted} opts - The encrypted message.
 * @returns {string} The decrypted message.
 */
export const decrypt = (privateKey: string, opts: Encrypted) => {
  let sharedSecret: Uint8Array;
  try {
    sharedSecret = secp256k1.getSharedSecret(hexToBytes(privateKey), opts.ephemPublicKey, true).slice(1);
  } catch (e) {
    throw new Error(`Invalid MAC: data integrity check failed: ${e}`);
  }

  const hash = sha512(sharedSecret);
  const encryptionKey = hash.subarray(0, 32);
  const macKey = hash.subarray(32);

  const ciphertext = hexToBytes(opts.ciphertext);
  const iv = hexToBytes(opts.iv);
  const ephemPublicKey = hexToBytes(opts.ephemPublicKey);
  const receivedMac = hexToBytes(opts.mac);

  // Recompute MAC
  const dataToMac = concatUint8Arrays([iv, ephemPublicKey, ciphertext]);
  const expectedMac = hmacSha256Sign(macKey, dataToMac);

  if (!constantTimeEqual(expectedMac, receivedMac)) {
    throw new Error('Invalid MAC: data integrity check failed');
  }

  const decrypted = aesDecrypt(ciphertext, encryptionKey, iv, 'aes-256-cbc');
  return bytesToUtf8(decrypted);
};

/**
 * Compares two Uint8Arrays in constant time to prevent timing attacks.
 * @param {Uint8Array} a - The first array.
 * @param {Uint8Array} b - The second array.
 * @returns {boolean} True if the arrays are equal, false otherwise.
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}
