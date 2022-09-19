import config from 'src/config/configuration';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get port from config app
  const port = config.port;

  // Enable for use in all website
  app.enableCors();

  // start app
  await app.listen(port);
}

bootstrap();
