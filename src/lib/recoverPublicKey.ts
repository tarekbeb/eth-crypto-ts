import { ecdsaRecover } from 'ethereum-cryptography/secp256k1-compat';
import { stripHexPrefix } from './util';
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils';

/**
 * returns the publicKey for the privateKey with which the messageHash was signed
 * @param  {string} signature
 * @param  {string} hash
 * @return {string} publicKey
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
