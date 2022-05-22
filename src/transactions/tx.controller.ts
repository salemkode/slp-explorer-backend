import { Controller, Get, Param } from '@nestjs/common';
import { TxService } from './tx.service';

@Controller('/tx/')
export class TxController {
  constructor(private readonly txService: TxService) {}

  @Get('/:txid')
  async getTransactions(@Param('txid') txid) {
    return await this.txService.getTxData(txid);
  }
}
