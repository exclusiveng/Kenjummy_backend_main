import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export type ServiceType = 'charter' | 'intercity' | 'vip' | 'hire';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.bookings, { nullable: false })
  user!: User;

  @Column({ type: 'enum', enum: ['charter', 'intercity', 'vip', 'hire'] })
  serviceType!: ServiceType;

  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' })
  status!: BookingStatus;

  @Column()
  fullName!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  // Optional fields
  @Column({ nullable: true })
  pickup?: string;

  @Column({ nullable: true })
  dropoff?: string;

  @Column({ nullable: true })
  departure?: string;

  @Column({ nullable: true })
  destination?: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'time', nullable: true })
  time?: string;

  @Column({ nullable: true })
  vehicle?: string;

  @Column({ nullable: true })
  duration?: string;

  @Column({ nullable: true })
  specialRequest?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'int', nullable: true })
  numberOfPassengers?: number;

  @Column({ type: 'date', nullable: true })
  startDate?: string;

  @Column({ type: 'time', nullable: true })
  startTime?: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @Column({ type: 'time', nullable: true })
  endTime?: string;

  @Column({ nullable: true })
  purpose?: string;

  @Column({ nullable: true })
  travelTime?: string;

  @Column({ type: 'simple-array', nullable: true })
  days?: string[];
}