import { Status } from '@prisma/client';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { User } from 'src/modules/users/entities/user.entity';

export class Activity {
  id!: string;
  customerId!: string;
  createdById!: string;
  title!: string;
  description!: string;
  dateOpen!: Date;
  dateClose?: Date | null;
  status!: Status;
  resolution?: string | null;

  customer!: Customer;
  createdBy!: User;
}
