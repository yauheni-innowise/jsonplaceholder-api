import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Geo } from './geo.entity';

/**
 * Address entity representing a user's address information
 */
@Entity('addresses')
export class Address {
  @ApiProperty({ example: 1, description: 'Unique identifier for the address' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123 Main St', description: 'Street name' })
  @Column({ type: 'varchar', length: 100 })
  street: string;

  @ApiProperty({ example: 'Apt 4B', description: 'Suite or apartment number' })
  @Column({ type: 'varchar', length: 100 })
  suite: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  @Column({ type: 'varchar', length: 100 })
  city: string;

  @ApiProperty({ example: '10001', description: 'Postal code' })
  @Column({ type: 'varchar', length: 20 })
  zipcode: string;

  @ApiProperty({ description: 'Geographic coordinates' })
  @OneToOne(() => Geo, { cascade: true, eager: true })
  @JoinColumn()
  geo: Geo;
}
