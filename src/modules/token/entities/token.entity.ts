import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @ApiHideProperty()
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  email!: string;

  @Column()
  token!: string;
}
