import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityReportDto } from './create-activity-report.dto';

export class UpdateActivityReportDto extends PartialType(CreateActivityReportDto) {}
