import { Module } from '@nestjs/common';
import { FullstackService } from 'src/fullstack/fullstack.service';
import { IndexerService } from 'src/indexer/indexer.service';
import { TokenModule } from 'src/token/token.module';
import { TxModule } from 'src/transactions/tx.module';
import { TxService } from 'src/transactions/tx.service';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  controllers: [AddressController],
  imports: [TokenModule, TxModule],
  providers: [AddressService, IndexerService, FullstackService],
})
export class AddressModule {}
