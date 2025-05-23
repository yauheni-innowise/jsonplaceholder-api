import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

/**
 * Auth entity for storing user authentication information
 */
@Entity('auth')
export class Auth {
  @ApiProperty({ example: 1, description: 'Unique identifier for the auth record' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email address used for authentication' })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiHideProperty()
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @ApiProperty({ description: 'Associated user record' })
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
