import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller()
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get('/customer')
  getCustomers(): string {
    return this.service.getCustomers();
  }
}
