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
export type balance_item = {
  tokenId: string;
  name: string;
  ticker: string;
  qty: string;
};

//
export type transaction_item = {
  block: number;
  txid: string;
  type: 'SEND' | 'RECV';
  qty: number;
  tokenId: string;
  tokenName: string;
};

//
export interface formated_slp_address {
  balance: {
    allPage: number;
    currentPage: number;
    balances: balance_item[];
  };
  transaction: {
    allPage: number;
    currentPage: number;
    transactions: transaction_item[];
  };
}
