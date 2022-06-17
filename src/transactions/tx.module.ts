import { Module } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { TxController } from './tx.controller';
import { TxService } from './tx.service';

@Module({
  imports: [TokenModule],
  controllers: [TxController],
  providers: [TxService, IndexerService, FullstackService],
})
export class TxModule {}
