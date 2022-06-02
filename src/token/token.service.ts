import { BadRequestException, Injectable } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TxService } from 'src/transactions/tx.service';
import { formated_slp_tx } from 'src/transactions/tx.type';
import { slice } from 'src/util/slice';
import BigNumber from 'big.js';
import {
  indexer_slp_token,
  formated_slp_token,
  token_data__tx,
} from './token.type';

@Injectable()
export class TokenService {
  constructor(
    private IndexerService: IndexerService,
    private TxService: TxService,
    private fullstack: FullstackService,
  ) {}

  //
  fatchTokenData(tokenId: string, withTxHistory = false) {
    try {
      // Return result data
      return this.IndexerService.post<indexer_slp_token>('token', {
        tokenId,
        withTxHistory,
      });
    } catch (_err) {
      throw new BadRequestException('This is not a slp token');
    }
  }

  //
  async getTokenData(tokenid: string): Promise<formated_slp_token> {
    // Fatch token data from slp explorer
    const tokenData = await this.fatchTokenData(tokenid, true);

    // Fatch transactions data from slp explorer
    const txData = await this.TxService.getTxData(tokenid);

    // Formated data
    return await this.formatTokenData(tokenData, txData);
  }

  //
  async formatTokenData(
    { tokenData }: indexer_slp_token,
    { details }: formated_slp_tx,
  ): Promise<formated_slp_token> {
    //
    return {
      details: {
        tokenId: tokenData.tokenId,
        name: tokenData.name,
        ticker: tokenData.ticker,
        creator: details.creator,
        decimals: tokenData.decimals,
        documentHash: tokenData.documentHash,
        documentUri: tokenData.documentUri,
        time: details.time,
        type: this.getTypeName(tokenData.type),
      },
      stats: {
        block: tokenData.blockCreated,
        mintBatonIsActive: tokenData.mintBatonIsActive,
        qtyTransactions: tokenData.txs.length,
        qtyAddresses: 0,
        totalMinted: tokenData.totalMinted,
        totalBurned: tokenData.totalBurned,
        tokensInCirculation: tokenData.tokensInCirculationStr,
      },
      tx: await this.getTxsInfo(tokenData),
    };
  }

  //
  getTypeName(
    versionNumber: number,
  ): 'type1' | 'nft1_group' | 'nft1_child' | 'unknown' {
    switch (versionNumber) {
      case 1:
        return 'type1';
      case 129:
        return 'nft1_group';
      case 65:
        return 'nft1_child';
      default:
        return 'unknown';
    }
  }

  //
  async getTxsInfo(
    tokenData: indexer_slp_token['tokenData'],
    index = 0,
  ): Promise<formated_slp_token['tx']> {
    tokenData.txs.reverse();

    //
    return {
      length: tokenData.txs.length,
      allPage: Math.ceil(tokenData.txs.length / 7),
      currentPage: index + 1,
      txs: await this.getTxsWithTime(tokenData.txs, index, tokenData.decimals),
    };
  }

  //
  getRealQty(qty: string, decimals: number): string {
    //
    const bigNumberQty = new BigNumber(qty);

    //
    return bigNumberQty.div(10 ** decimals).toString();
  }

  //
  async getTxsWithTime(
    txs: indexer_slp_token['tokenData']['txs'],
    i: number,
    decimals: number,
  ): Promise<formated_slp_token['tx']['txs']> {
    //
    type formatedTxType = formated_slp_token['tx']['txs'][0];
    const promises: Promise<formatedTxType>[] = [];

    //
    const getTxWithTimePromise = async (tx: token_data__tx) => {
      let time: number;

      //
      let { qty } = tx;
      const { txid, height, type } = tx;

      //
      try {
        time = await this.TxService.getTranstionTime(txid);
      } catch (err) {
        time = 0;
      }

      //
      if (tx.burned) {
        qty = tx.burned;
      }

      //
      return {
        txid,
        block: height,
        qty: this.getRealQty(qty, decimals),
        type,
        time,
      };
    };

    // Select 7 items by index
    const _txs = slice(txs, i * 7, (i + 1) * 7);

    //
    _txs.forEach((tx: token_data__tx) => {
      promises.push(getTxWithTimePromise(tx));
    });

    //
    return Promise.all(promises);
  }
}
