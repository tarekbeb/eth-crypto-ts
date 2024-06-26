import { solidityPackedKeccak256 } from "ethers";

export class Hash {
  constructor() {}

  keccak256(params: any | any[]) {
    const types = [];
    const values = [];
    if (!Array.isArray(params)) {
      types.push('string');
      values.push(params);
    } else {
      params.forEach((p) => {
        types.push(p.type);
        values.push(p.value);
      });
    }
    return solidityPackedKeccak256(types, values);
  }
}
