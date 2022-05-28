import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TxModule } from './transactions/tx.module';

import configuration from "./config/configuration";
import { AddressModule } from './address/address.module';
@Module({
  imports: [
    TxModule,
    AddressModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
