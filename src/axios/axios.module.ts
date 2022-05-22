import { Global, Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AxiosService],
})
export class AxiosModule {}
