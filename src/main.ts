import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port: number | undefined = configService.get('PORT');

  await app.listen(port ?? 3200);
  console.log(port);
  console.log('ON ');
}
void bootstrap();
