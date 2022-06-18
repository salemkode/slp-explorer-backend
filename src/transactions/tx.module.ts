import { forwardRef, Module } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TokenModule } from 'src/token/token.module';
import { TxController } from './tx.controller';
import { TxService } from './tx.service';

@Module({
  imports: [forwardRef(() => TokenModule)],
  controllers: [TxController],
  exports: [TxService],
  providers: [TxService, IndexerService, FullstackService],
})
export class TxModule {}
