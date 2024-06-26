import { privateToPublic, toBuffer } from "ethereumjs-util";
import { addLeading0x } from "./utils";

type publicKeyByPrivateKeyType = (privateKey: string) => string;

/**
 * Generate publicKey from the privateKey.
 * This creates the uncompressed publicKey,
 * where 04 has stripped from left
 * @param {string} privateKey
 * @returns {string}
 */
export function publicKeyByPrivateKey(privateKey: string) {
  privateKey = addLeading0x(privateKey);
  const publicKeyBuffer = privateToPublic(toBuffer(privateKey));

  return publicKeyBuffer.toString('hex');
}