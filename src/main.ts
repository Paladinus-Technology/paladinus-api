import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { corsConfig } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';
import { validationConfig } from './config/validation.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  corsConfig(app);
  setupSwagger(app);
  validationConfig(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('/api/v1');

  const port: number | undefined = configService.get('PORT');

  await app.listen(port ?? 3200);
  console.log(`On in port ${port}`);
}
bootstrap();
