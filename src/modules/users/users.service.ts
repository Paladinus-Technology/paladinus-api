import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name, customerId, role } = createUserDto;

    const emailUser = await this.repository.findByEmail(email);
    if (emailUser) {
      return 'Email já Cadastrado!';
    }

    const bPassword = await this.hashPassword(password);

    return this.repository.createUser({
      name,
      email,
      password: bPassword,
      customerId,
      role,
    });
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
