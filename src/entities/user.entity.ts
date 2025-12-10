import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  Check,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Booking } from './booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'superadmin'], default: 'user' })
  @Check(`"role" IN ('user', 'admin', 'superadmin')`)
  role!: 'user' | 'admin' | 'superadmin';

  @Column({ default: true })
  isActive!: boolean;

  @Column({ select: false })
  password!: string;

  @OneToMany(() => Booking, booking => booking.user)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}