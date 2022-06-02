import { Module } from '@nestjs/common';
import { IndexerService } from 'src/indexer/indexer.service';
import { TokenModule } from 'src/token/token.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  controllers: [AddressController],
  imports: [TokenModule],
  providers: [AddressService, IndexerService],
})
export class AddressModule {}
