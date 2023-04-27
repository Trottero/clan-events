import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  console.log('Starting app on port 3000: http://localhost:3000');
  await app.listen(3000);
}
bootstrap();
