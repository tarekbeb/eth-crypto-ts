import { publicKeyByPrivateKey } from '../publicKeyByPrivateKey';

const PRIVATE_KEY = '0xb966663733f9dacb81ccf336508bb334cca74136f6063783f737fb4c12c96c63';
const PUBLIC_KEY =
  '482a8203fc2c502f1f2f5112ca4abec8a25835c6627bac4c479d93c140ff7d9bbc7fb8913e2aaeae26871966af70a739aa0305b5256c4abb8e8d016ccf795f44';
describe('publicKeyByPrivateKey', () => {
  it('should generate the correct public key from a given private key', () => {
    const publicKey = publicKeyByPrivateKey(PRIVATE_KEY);
    expect(publicKey).toBe(PUBLIC_KEY);
  });

  it('should handle invalid private keys gracefully', () => {
    const invalidPrivateKey = 'invalid';
    expect(() => publicKeyByPrivateKey(invalidPrivateKey)).toThrow();
  });
});
