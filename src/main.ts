import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({ origin: ' http://localhost:4200' });

  const config = new DocumentBuilder()
    .setTitle('Paladinus API')
    .setDescription('API documentation for the Paladinus platform.')
    .setVersion('0.1')
    .setContact(
      'Paladinus Dev Team',
      'https://paladinusse.com',
      'paladinusse@gmail.com',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port: number | undefined = configService.get('PORT');

  await app.listen(port ?? 3200);
  console.log(`On in port ${port}`);
}
bootstrap();
