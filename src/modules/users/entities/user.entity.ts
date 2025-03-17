import { Role } from '@prisma/client';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Activity } from 'src/modules/activity-report/entities/activity-report.entity';

export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  customerId!: string;
  role!: Role;

  customer?: Customer;
  activities?: Activity[];
}
