import { Module } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TxService } from 'src/transactions/tx.service';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [],
  controllers: [TokenController],
  exports: [TokenService, IndexerService, TxService, FullstackService],
  providers: [TokenService, IndexerService, TxService, FullstackService],
})
export class TokenModule {}
