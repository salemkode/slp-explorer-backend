//
export interface indexer_slp_tx {
  txData: {
    txid: string;
    hash: string;
    version: number;
    size: number;
    locktime: number;
    vin: Array<{
      txid?: string;
      vout: 1;
      scriptSig: {
        asm: string;
        hex: string;
      };
      sequence: number;
      address: string;
      value: number;
      tokenQty: number;
      tokenQtyStr: string;
      tokenId: string | null;
    }>;
    vout: Array<{
      value: number;
      n: number;
      scriptPubKey: {
        asm: string;
        hex: string;
        type: string;
        reqSigs?: 1;
        addresses?: string[];
      };
      opReturnData: {
        tokenType: number;
        txType: string;
        ticker: string;
        name: string;
        tokenId: string;
        documentUri: string;
        documentHash: string;
        decimals: number;
        mintBatonVout: number;
        qty: string;
      };
      tokenQtyStr: string;
      tokenQty: number;
      isMintBaton?: boolean;
    }>;
    hex: string;
    blockhash: string;
    confirmations: number;
    time: number;
    blocktime: number;
    blockheight: number;
    isSlpTx: boolean;
    tokenTxType: string;
    tokenId: string;
    tokenType: number;
    tokenTicker: string;
    tokenName: string;
    tokenDecimals: number;
    tokenUri: string;
    tokenDocHash: string;
    isValidSlp: boolean;
  };
}

//
export interface formated_slp_tx {
  details: {
    type: string;
    block: number;
    time: number;
    txid: string;
    creator: string;
  };
  token: {
    type: number;
    ticker: string;
    name: string;
    tokenId: string;
    documentUri: string;
    documentHash: string;
    decimals: number;
  };
  inputs: {
    qty: string;
    address: string;
    txid?: string;
  }[];
  outputs: {
    qty?: string;
    address: string;
    mint_baton: boolean;
  }[];
}
