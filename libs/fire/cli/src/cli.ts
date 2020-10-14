import { NestFactory } from '@nestjs/core';
import { SeekCommandModule, SeekCommandService } from '@nxseek/command';
import { FireCliModule } from './lib/fire-cli.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(FireCliModule, {
    logger: ['error'], // only errors
  });
  app.select(SeekCommandModule).get(SeekCommandService).exec();
}
bootstrap();
