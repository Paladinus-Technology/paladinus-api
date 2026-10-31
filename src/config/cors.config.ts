import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function corsConfig(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const allowedOrigin = configService.get<string>('CORS_ORIGIN') || '*';

  app.enableCors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
}
