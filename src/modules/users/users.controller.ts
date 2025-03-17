import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get() {
    return 'pegou um membro, lá ele!';
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User | string> {
    return this.usersService.createUser(createUserDto);
  }
}
