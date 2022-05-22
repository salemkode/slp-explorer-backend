import { Module } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TxController } from './tx.controller';
import { TxService } from './tx.service';

@Module({
  imports: [],
  controllers: [TxController],
  providers: [TxService, IndexerService, FullstackService],
})
export class TxModule {}
