export type Encrypted = {
  iv: string,
  ephemPublicKey: string,
  ciphertext: string,
  mac: string
};

export type EncryptOptions = {
  iv?: Buffer,
  ephemPrivateKey?: Buffer
};
