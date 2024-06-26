import { publicKeyConvert } from 'secp256k1';
import { uint8ArrayToHex, hexToUnit8Array } from './utils';

export function compress(startsWith04: any) {
  // add trailing 04 if not done before
  const testBuffer = Buffer.from(startsWith04, 'hex');
  if (testBuffer.length === 64) startsWith04 = '04' + startsWith04;

  return uint8ArrayToHex(publicKeyConvert(hexToUnit8Array(startsWith04), true));
}
