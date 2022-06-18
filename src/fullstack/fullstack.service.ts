import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/axios/axios.service';
import { getTransactionDetails, getBlock } from './fullstack.type';

@Injectable()
export class FullstackService extends AxiosService {
  constructor(config: ConfigService) {
    super(
      axios.create({
        baseURL: config.get('fullstack.url'),
        headers: {
          // For fullstack api
          Authorization: `Token ${config.get('indexer.jwt')}`,
        },
      }),
    );
  }

  // https://api.fullstack.cash/v5/electrumx/tx/data/:txid
  getTransactionDetails(txid: string): Promise<getTransactionDetails> {
    return this.get<getTransactionDetails>(`electrumx/tx/data/${txid}`);
  }

  //
  async getBlock(hashOrHeight: string | number): Promise<getBlock> {
    let blockhash: string;

    // Get hash from block
    if (typeof hashOrHeight === 'number') {
      blockhash = await this.getBlockHash(hashOrHeight);
    } else {
      blockhash = hashOrHeight;
    }

    //
    return await this.post<getBlock>(`/blockchain/getBlock`, {
      blockhash,
    });
  }

  //
  getBlockHash(height: number): Promise<string> {
    return this.get<string>(`/blockchain/getBlockHash/${height}`);
  }
}
