import { Injectable } from '@nestjs/common';
import { CreateActivityReportDto } from './dto/create-activity-report.dto';
import { UpdateActivityReportDto } from './dto/update-activity-report.dto';

@Injectable()
export class ActivityReportService {
  create(createActivityReportDto: CreateActivityReportDto) {
    return 'This action adds a new activityReport';
  }

  findAll() {
    return `This action returns all activityReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activityReport`;
  }

  update(id: number, updateActivityReportDto: UpdateActivityReportDto) {
    return `This action updates a #${id} activityReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityReport`;
  }
}
