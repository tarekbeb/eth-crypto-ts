import { keccak256, Wallet, concat, randomBytes } from 'ethers';
import { publicKeyByPrivateKey } from './public-key-by-private-key';
import { MIN_ENTROPY_SIZE } from '../constants';

/**
 * create a privateKey from the given entropy or a new one
 * @param  {Buffer} entropy
 * @return {string}
 */
export function createPrivateKey(entropy?: Buffer) {
  if (entropy) {
    if (!Buffer.isBuffer(entropy)) throw new Error('EthCrypto.createPrivateKey(): given entropy is no Buffer');
    if (Buffer.byteLength(entropy, 'utf8') < MIN_ENTROPY_SIZE)
      throw new Error('EthCrypto.createPrivateKey(): Entropy-size must be at least ' + MIN_ENTROPY_SIZE);

    const outerHex = keccak256(entropy);
    return outerHex;
  } else {
    const innerHex = keccak256(concat([randomBytes(32), randomBytes(32)]));
    const middleHex = concat([concat([randomBytes(32), innerHex]), randomBytes(32)]);
    const outerHex = keccak256(middleHex);
    return outerHex;
  }
}

/**
 * creates a new object with
 * private-, public-Key and address
 * @param {Buffer?} entropy if provided, will use that as single random-source
 */
export function createIdentity(entropy?: Buffer) {
  const privateKey = createPrivateKey(entropy);
  const wallet = new Wallet(privateKey);
  const identity = {
    privateKey: privateKey,
    publicKey: publicKeyByPrivateKey(privateKey),
    address: wallet.address,
  };

  return identity;
}
