import { Encrypted } from '../../types';
import { compress } from '../compress-public-key';
import { decompress } from '../decompress-public-key';

interface CipherInterface {
  stringify(encrypted: Encrypted): string;
  parse(string: string): Encrypted;
}

export class Cipher implements CipherInterface {
  constructor() {}

  stringify(encrypted: Encrypted) {
    if (typeof encrypted === 'string') return encrypted;

    // use compressed key because it's smaller
    const compressedKey = compress(encrypted.ephemPublicKey);

    const ret = Buffer.concat([
      Buffer.from(encrypted.iv, 'hex'), // 16bit
      Buffer.from(compressedKey, 'hex'), // 33bit
      Buffer.from(encrypted.mac, 'hex'), // 32bit
      Buffer.from(encrypted.ciphertext, 'hex'), // var bit
    ]);

    return ret.toString('hex');
  }

  parse(str: string): Encrypted {
    if (typeof str !== 'string') return str;

    const buf = Buffer.from(str, 'hex');

    const ret = {
      iv: buf.toString('hex', 0, 16),
      ephemPublicKey: buf.toString('hex', 16, 49),
      mac: buf.toString('hex', 49, 81),
      ciphertext: buf.toString('hex', 81, buf.length),
    };

    // decompress publicKey
    ret.ephemPublicKey = '04' + decompress(ret.ephemPublicKey);

    return ret;
  }
}
