import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
  getActivitys(): string {
    return 'pegando Atividades';
  }
}
