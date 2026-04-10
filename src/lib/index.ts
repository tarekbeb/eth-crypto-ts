import { createIdentity } from './create-identity';
import { sign } from './sign';
import { encryptWithPublicKey } from './encrypt-with-public-key';
import { decryptWithPrivateKey } from './decrypt-with-private-key';
import { keccak256 } from './hash';
import { publicKeyByPrivateKey } from './public-key-by-private-key';
import { recoverPublicKey } from './recoverPublicKey';

const hash = {
  keccak256,
};

export {
  createIdentity,
  decryptWithPrivateKey,
  encryptWithPublicKey,
  hash,
  keccak256,
  publicKeyByPrivateKey,
  recoverPublicKey,
  sign,
};

export default {
  createIdentity,
  decryptWithPrivateKey,
  encryptWithPublicKey,
  hash,
  keccak256,
  publicKeyByPrivateKey,
  recoverPublicKey,
  sign,
};
