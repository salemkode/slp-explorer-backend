import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { AxiosService } from 'src/axios/axios.service';
import { getTransactionDetails, getBlock } from './fullstack.type';
import config from 'src/config/configuration';
import * as apiToken from './fullstack.token';

@Injectable()
export class FullstackService extends AxiosService {
  constructor() {
    super(
      axios.create({
        baseURL: config.fullstack.url,
      }),
    );

    apiToken.onRefresh((token) => {
      this.updateInstance(
        axios.create({
          baseURL: config.fullstack.url,
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
      );
    });
  }

  // https://api.fullstack.cash/v5/electrumx/tx/data/:txid
  getTransactionDetails(txid: string): Promise<getTransactionDetails> {
    return this.get<getTransactionDetails>(`electrumx/tx/data/${txid}`);
  }

  //
  async getBlock(hashOrHeight: string | number): Promise<getBlock> {
    let blockHash: string;

    // Get hash from block
    if (typeof hashOrHeight === 'number') {
      blockHash = await this.getBlockHash(hashOrHeight);
    } else {
      blockHash = hashOrHeight;
    }

    //
    return await this.post<getBlock>(`/blockchain/getBlock`, {
      blockHash,
    });
  }

  //
  getBlockHash(height: number): Promise<string> {
    return this.get<string>(`/blockchain/getBlockHash/${height}`);
  }
}
