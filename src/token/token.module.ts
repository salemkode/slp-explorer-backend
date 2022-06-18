import { forwardRef, Module } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TxModule } from 'src/transactions/tx.module';
import { TxService } from 'src/transactions/tx.service';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [forwardRef(() => TxModule)],
  controllers: [TokenController],
  exports: [TokenService],
  providers: [TokenService, TxService, IndexerService, FullstackService],
})
export class TokenModule {}
