import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
export function validationConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
