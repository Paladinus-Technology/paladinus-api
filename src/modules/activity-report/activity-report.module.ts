import { Module } from '@nestjs/common';
import { ActivityReportService } from './activity-report.service';
import { ActivityReportController } from './activity-report.controller';

@Module({
  controllers: [ActivityReportController],
  providers: [ActivityReportService],
})
export class ActivityReportModule {}
