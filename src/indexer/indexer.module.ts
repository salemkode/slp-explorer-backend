import { Global, Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';

@Global()
@Module({
  imports: [],
  providers: [IndexerService],
})
export class IndexerModule {}
