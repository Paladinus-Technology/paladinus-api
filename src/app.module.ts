import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { ActivityReportModule } from './modules/activity-report/activity-report.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    CustomerModule,
    ActivityReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('users', 'customers', '*');
  }
}
