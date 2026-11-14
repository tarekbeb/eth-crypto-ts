import { ecdsaRecover } from 'ethereum-cryptography/secp256k1-compat';
import { stripHexPrefix } from './utils';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';

/**
 * Recovers the signer's public key from a signature made by `sign`.
 * Any `v` other than `1c` is treated as recovery id 0.
 * @param  {string} signature - `0x`-optional hex, r||s||v.
 * @param  {string} hash - The 32-byte hash that was signed.
 * @return {string} Uncompressed public key hex without `0x` or `04` (128 chars).
 */
export const recoverPublicKey = (signature: string, hash: string) => {
  const noHex = stripHexPrefix(signature);

  // split into v-value and sig
  const sigOnly = noHex.substring(0, noHex.length - 2); // all but last 2 chars
  const vValue = noHex.slice(-2); // last 2 chars

  const recoveryNumber = vValue === '1c' ? 1 : 0;

  let pubKey = bytesToHex(ecdsaRecover(hexToBytes(sigOnly), recoveryNumber, hexToBytes(stripHexPrefix(hash)), false));

  // remove trailing '04'
  pubKey = pubKey.slice(2);

  return pubKey;
};
