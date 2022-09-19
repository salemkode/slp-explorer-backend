import { CacheModule, Module } from '@nestjs/common';
import { TxModule } from './transactions/tx.module';

import { TokenModule } from './token/token.module';
import { AddressModule } from './address/address.module';
@Module({
  imports: [
    TxModule,
    TokenModule,
    AddressModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 60,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
