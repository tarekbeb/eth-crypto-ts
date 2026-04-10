export type Encrypted = {
  iv: string;
  ephemPublicKey: string;
  ciphertext: string;
  mac: string;
};

export type EncryptionOptions = {
  ephemPrivateKey?: string;
};
