import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/guard/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api/v1');
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

  app.useGlobalGuards(new AuthGuard(jwtService, configService, reflector));
  await app.listen(port ?? 3200);
  console.log(`On in port ${port}`);
}
bootstrap();
