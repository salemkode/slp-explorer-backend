import { Global, Module } from '@nestjs/common';
import { FullstackService } from './fullstack.service';

@Global()
@Module({
  providers: [FullstackService],
})
export class FullstackModule {}
