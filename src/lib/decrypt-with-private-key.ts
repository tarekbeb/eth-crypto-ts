import { decrypt } from 'eccrypto';
import { Encrypted } from '../types';
import { removeLeading0x } from './utils';
import { Cipher } from './cipher';

export function decryptWithPrivateKey(privateKey: string, encrypted: Encrypted | any) {
  const cipher = new Cipher();

  // ensuring the encrypted data is in the correct format.
  encrypted = cipher.parse(encrypted);

  // remove trailing '0x' from privateKey
  const twoStripped = removeLeading0x(privateKey);

  const encryptedBuffer = {
    iv: Buffer.from(encrypted.iv, 'hex'),
    ephemPublicKey: Buffer.from(encrypted.ephemPublicKey, 'hex'),
    ciphertext: Buffer.from(encrypted.ciphertext, 'hex'),
    mac: Buffer.from(encrypted.mac, 'hex'),
  };

  return decrypt(Buffer.from(twoStripped, 'hex'), encryptedBuffer).then((decryptedBuffer) => decryptedBuffer.toString());
}
