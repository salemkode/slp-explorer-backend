// item of txs in Token_data
export interface token_data__tx {
  txid: string;
  height: number;
  type: 'GENESIS' | 'SEND' | 'MINT' | 'BURN-UNCONTROLLED' | 'SEND-BURN';
  qty: string;
  burned?: string;
}

//
export interface indexer_slp_token {
  tokenData: {
    type: number;
    ticker: string;
    name: string;
    tokenId: string;
    documentUri: string;
    documentHash: string;
    decimals: number;
    mintBatonIsActive: boolean;
    tokensInCirculationBN: string;
    tokensInCirculationStr: string;
    blockCreated: number;
    totalMinted: string;
    totalBurned: string;
    txs: Array<token_data__tx> | undefined;
  };
}

//
export interface formated_slp_token {
  details: {
    tokenId: string;
    type: 'type1' | 'nft1_group' | 'nft1_child' | 'unknown';
    name: string;
    ticker: string;
    creator: string;
    time: number;
    decimals: number;
    documentUri: string;
    documentHash: string;
  };
  stats: {
    block: number;
    tokensInCirculation: string;
    mintBatonIsActive: boolean;
    totalMinted: string;
    totalBurned: string;
    qtyTransactions: number;
    qtyAddresses: number;
  };
  tx: {
    length: number;
    allPage: number;
    currentPage: number;
    txs: {
      txid: string;
      type: string;
      qty: string;
      block: number;
      time: number;
    }[];
  };
}
