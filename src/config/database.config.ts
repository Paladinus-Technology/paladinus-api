import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = configService.get<string>('DB_TYPE')?.replace(/"/g, '').trim();

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get<string>('DB_LITE_NAME'),
      synchronize: true,
      logging: true,
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
    };
  }
  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_POSTGRES_HOST'),
      port: parseInt(configService.get('DB_POSTGRES_PORT') || '5432'),
      username: configService.get<string>('DB_POSTGRES_USERNAME'),
      password: configService.get<string>('DB_POSTGRES_PASSWORD'),
      database: configService.get<string>('DB_POSTGRES_DATABASE'),
      synchronize: false,
      logging: true,
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
    };
  }
  if (dbType === 'mssql') {
    return {
      type: 'mssql',
      host: configService.get('DB_MSQL_HOST'),
      port: parseInt(configService.get('DB_MSQL_PORT') || '1433'),
      username: configService.get('DB_MSQL_USERNAME'),
      password: configService.get('DB_MSQL_PASSWORD'),
      database: configService.get('DB_MSQL_DATABASE'),
      synchronize: false,
      logging: true,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
    };
  }

  if (dbType === 'mongodb') {
    return {
      type: 'mongodb',
      url: configService.get('DATABASE_URL_MONGODB'),
      synchronize: true,
      logging: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
    };
  }
  throw new Error('DB_TYPE não suportado');
};
