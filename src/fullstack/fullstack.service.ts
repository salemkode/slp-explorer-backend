import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/axios/axios.service';
import { getTransactionDetails } from './fullstack.type';

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
}
