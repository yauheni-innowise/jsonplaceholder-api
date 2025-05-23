import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Company entity representing a user's company information
 */
@Entity('companies')
export class Company {
  @ApiProperty({ example: 1, description: 'Unique identifier for the company' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Acme Inc.', description: 'Company name' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'Multi-layered client-server neural-net', description: 'Company catchphrase' })
  @Column({ type: 'varchar', length: 200 })
  catchPhrase: string;

  @ApiProperty({ example: 'harness real-time e-markets', description: 'Company business strategy' })
  @Column({ type: 'varchar', length: 200 })
  bs: string;
}
