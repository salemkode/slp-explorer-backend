export interface getTransactionDetails {
  success: true;
  details: {
    hex: string;
    txid: string;
    hash: string;
    size: number;
    version: number;
    vin: {
      txid: string;
      vout: number;
      scriptSig: {
        asm: string;
        hex: string;
        sequence: string;
      };
    }[];
    vout: {
      value: number;
      n: number;
      scriptPubkey: {
        asm: string;
        hex: string;
        reqSigs: number;
        type: string;
        addresses: string[];
      };
    }[];
    blockhash: string;
    confirmations: number;
    time: number;
    blocktime: number;
  };
}

export interface getBlock {
  bits: string;
  chainwork: string;
  confirmations: number;
  difficulty: number;
  hash: string;
  height: number;
  mediantime: number;
  merkleroot: string;
  nTx: number;
  nextblockhash: string;
  nonce: number;
  previousblockhash: string;
  size: number;
  time: number;
  tx: string[];
  version: number;
  versionHex: number;
}
