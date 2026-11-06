import { Body, Controller, Get, Post } from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { getUserToken } from 'src/common/decorators/getUserToken.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(UserRole.MASTER)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }
  @Roles(UserRole.MASTER)
  @Get('all')
  findAll(@getUserToken() userToken: JwtPayload) {
    return this.companyService.findAll();
  }
}
