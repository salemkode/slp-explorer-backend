import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { toSlpAddress } from 'bchaddrjs-slp';
import { Cache } from 'cache-manager';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { formated_slp_tx, indexer_slp_tx } from './tx.type';

@Injectable()
export class TxService {
  constructor(
    private IndexerService: IndexerService,
    private Fullstack: FullstackService,
    @Inject(CACHE_MANAGER) private CacheManager: Cache,
  ) {}

  //
  async fatchTxData(txid: string, cache = false): Promise<indexer_slp_tx> {
    try {
      //
      const cacheKey = `tx-${txid}`;

      //
      if (cache) {
        //
        const cachedData = await this.CacheManager.get<indexer_slp_tx>(
          cacheKey,
        );

        //
        if (cachedData) {
          return cachedData;
        }
      }

      //
      const txData = await this.IndexerService.post<indexer_slp_tx>('txid', {
        txid,
      });

      //
      if (cache) await this.CacheManager.set<indexer_slp_tx>(cacheKey, txData);

      // Return result data
      return txData;
    } catch (_err) {
      const error = _err as AxiosError<{ error: string; success: number }>;

      //
      throw new BadRequestException(error.response.data.error);
    }
  }

  //
  async getTxData(txid: string): Promise<formated_slp_tx> {
    // Fatch data from slp explorer
    const data = await this.fatchTxData(txid);

    // Formated data
    return this.formatTxData(data);
  }

  //
  async formatTxData({ txData }: indexer_slp_tx): Promise<formated_slp_tx> {
    let time = txData.time;

    //
    if (!time) time = await this.getTranstionTime(txData.txid);

    //
    return {
      details: {
        type: txData.tokenTxType,
        block: txData.blockheight,
        time: time,
        txid: txData.txid,
        creator: this.getCreator(txData),
      },
      token: {
        tokenId: txData.tokenId,
        name: txData.tokenName,
        ticker: txData.tokenTicker,
        decimals: txData.tokenDecimals,
        documentUri: txData.tokenUri,
        documentHash: txData.tokenDocHash,
        type: txData.tokenType,
      },
      inputs: this.getInputs(txData),
      outputs: this.getOutputs(txData),
    };
  }

  // Get creator of transction
  getCreator({ vout }: indexer_slp_tx['txData']): string {
    // Get PubKey
    const scriptPubKey = vout[1].scriptPubKey;

    // Get cash address
    const CashAddress = scriptPubKey.addresses[0];

    // Convert to slp address
    const SlpAddress = toSlpAddress(CashAddress);

    // Return value
    return SlpAddress;
  }

  // Get inputs data from token data
  getInputs(txData: indexer_slp_tx['txData']): formated_slp_tx['inputs'] {
    const inputs: formated_slp_tx['inputs'] = [];

    txData.vin.forEach((item) => {
      // Check is value big than zero
      if (item.tokenQty) {
        inputs.push({
          address: toSlpAddress(item.address),
          qty: item.tokenQtyStr,
          txid: item.txid,
        });
      }
    });

    return inputs;
  }

  // Get outputs data from token data
  getOutputs(txData: indexer_slp_tx['txData']) {
    const outputs: formated_slp_tx['outputs'] = [];

    //
    txData.vout.forEach((item) => {
      const addresses = item.scriptPubKey.addresses;
      if (addresses) {
        //
        if (item.tokenQty) {
          outputs.push({
            address: item.isMintBaton ? undefined : toSlpAddress(addresses[0]),
            qty: item.tokenQtyStr,
            mint_baton: item.isMintBaton,
          });
        }
      }
    });

    //
    return outputs;
  }

  //
  async getTranstionTime(txid: string): Promise<number> {
    const {
      details: { time, blocktime },
    } = await this.Fullstack.getTransactionDetails(txid);

    //
    return time || blocktime;
  }
}
