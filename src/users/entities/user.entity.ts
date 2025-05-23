import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from './address.entity';
import { Company } from './company.entity';

/**
 * User entity representing a user in the system
 * Based on the JSONPlaceholder model
 */
@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({ description: 'User address information' })
  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn()
  address: Address;

  @ApiProperty({ example: '123-456-7890', description: 'Contact phone number' })
  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @ApiProperty({ example: 'example.com', description: 'User website' })
  @Column({ type: 'varchar', length: 100 })
  website: string;

  @ApiProperty({ description: 'User company information' })
  @OneToOne(() => Company, { cascade: true, eager: true })
  @JoinColumn()
  company: Company;
}
