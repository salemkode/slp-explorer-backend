import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TxModule } from './transactions/tx.module';

import configuration from './config/configuration';
import { TokenModule } from './token/token.module';
import { AddressModule } from './address/address.module';
@Module({
  imports: [
    TxModule,
    TokenModule,
    AddressModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
