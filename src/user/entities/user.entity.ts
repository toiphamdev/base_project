import { Role } from '../../auth/enum/role.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ default: false, type: Boolean })
  isActive: boolean;

  @Column({ type: Date })
  createdAt: Date;

  @Column({ type: Date })
  updatedAt: Date;
}
