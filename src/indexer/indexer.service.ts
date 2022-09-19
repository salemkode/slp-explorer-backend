import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { AxiosService } from 'src/axios/axios.service';
import * as apiToken from 'src/fullstack/fullstack.token';
import config from 'src/config/configuration';

@Injectable()
export class IndexerService extends AxiosService {
  constructor() {
    super(
      axios.create({
        baseURL: config.indexer.url,
      }),
    );

    apiToken.onRefresh((token) => {
      this.updateInstance(
        axios.create({
          baseURL: config.indexer.url,
          headers: {
            Authorization: `Token ${token}`,
          },
        }),
      );
    });
  }
}
