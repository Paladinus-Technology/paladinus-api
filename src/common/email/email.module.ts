import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    // useFactory: (configService: ConfigService) => {
    //   const port = Number(configService.get<string>('EMAIL_PORT') || 587);
    //   const secureConfig = configService.get<string>('EMAIL_SECURE');

    //   const secure =
    //     secureConfig !== undefined ? secureConfig === 'true' : port === 465;
    //   return {
    //     transport: {
    //       host: configService.get<string>('EMAIL_HOST'),
    //       port: port,
    //       secure: secure,
    //       auth: {
    //         user: configService.get<string>('EMAIL_USER'),
    //         pass: configService.get<string>('EMAIL_PASS'),
    //       },
    //       connectionTimeout: 10000,
    //       greetingTimeout: 10000,
    //       socketTimeout: 10000,
    //     },
    //     defaults: {
    //       from: configService.get<string>('EMAIL_FROM'),
    //     },
    //   };
    // },
    //   }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
