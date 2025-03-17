import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivityReportService } from './activity-report.service';
import { CreateActivityReportDto } from './dto/create-activity-report.dto';
import { UpdateActivityReportDto } from './dto/update-activity-report.dto';

@Controller('activity-report')
export class ActivityReportController {
  constructor(private readonly activityReportService: ActivityReportService) {}

  @Post()
  create(@Body() createActivityReportDto: CreateActivityReportDto) {
    return this.activityReportService.create(createActivityReportDto);
  }

  @Get()
  findAll() {
    return this.activityReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityReportDto: UpdateActivityReportDto) {
    return this.activityReportService.update(+id, updateActivityReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityReportService.remove(+id);
  }
}
