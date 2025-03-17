import { User } from 'src/modules/users/entities/user.entity';
import { Activity } from 'src/modules/activity-report/entities/activity-report.entity';

export class Customer {
  id!: string;
  name!: string;
  cnpj!: string;
  users?: User[];
  activities?: Activity[];
}
