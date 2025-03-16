import { Controller, Get } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('/activity')
  getActivitys(): string {
    return this.activityService.getActivitys();
  }
}
