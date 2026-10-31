import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class User {
  @ApiHideProperty()
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;

  @Column()
  companyId!: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
