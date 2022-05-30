import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //
  const configService = app.get(ConfigService);

  // Get port from config app
  const port = configService.get('port');

  // Enable for use in all website
  app.enableCors();

  // start app
  await app.listen(port);
}

bootstrap();
