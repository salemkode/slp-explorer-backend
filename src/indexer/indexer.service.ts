import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/axios/axios.service';

@Injectable()
export class IndexerService extends AxiosService {
  constructor(config: ConfigService) {
    super(
      axios.create({
        baseURL: config.get('indexer.url'),
        headers: {
          // For fullstack api
          Authorization: `Token ${config.get('indexer.jwt')}`,
        },
      }),
    );
  }
}
