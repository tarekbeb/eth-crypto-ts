import { encrypt } from 'eccrypto';
import { Encrypted, EncryptOptions } from '../types';
import { decompress } from './decompress-public-key';

export function encryptWithPublicKey(publicKey: string, message: string, options?: EncryptOptions): Promise<Encrypted> {

  // ensure its an uncompressed publicKey
  publicKey = decompress(publicKey);

  // re-add the compression-flag
  const pubString = '04' + publicKey;

  return encrypt(Buffer.from(pubString, 'hex'), Buffer.from(message), options ? options : {}).then((encryptedBuffers) => {
    const encrypted = {
      iv: encryptedBuffers.iv.toString('hex'),
      ephemPublicKey: encryptedBuffers.ephemPublicKey.toString('hex'),
      ciphertext: encryptedBuffers.ciphertext.toString('hex'),
      mac: encryptedBuffers.mac.toString('hex'),
    };

    return encrypted;
  });
}
