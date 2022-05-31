export interface indexer_slp_address {
  balance: {
    utxos: Array<{
      txid: string;
      vout: number;
      type: string;
      tokenType: number;
      qty: string;
      tokenId: string;
      address: string;
      decimals: number;
      effectiveQty: string;
      value: number;
    }>;
    txs: Array<{
      txid: string;
      height: string;
    }>;
    balances: Array<{
      tokenId: string;
      qty: string;
    }>;
  };
}

//
export interface formated_slp_address {
  balance: {
    allPage: number;
    currentPage: number;
    balances: {
      tokenId: string;
      name: string;
      ticker: string;
      qty: string;
    }[];
  };
  transaction: {
    allPage: number;
    currentPage: number;
    transactions: {
      block: number;
      txid: string;
      type: string;
      qty: number;
      tokenId: string;
      tokenName: string;
    }[];
  };
}
