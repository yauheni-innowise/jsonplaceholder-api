import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Geo entity representing geographical coordinates
 */
@Entity('geos')
export class Geo {
  @ApiProperty({ example: 1, description: 'Unique identifier for the geo coordinates' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '40.7128', description: 'Latitude coordinate' })
  @Column({ type: 'varchar', length: 50 })
  lat: string;

  @ApiProperty({ example: '-74.0060', description: 'Longitude coordinate' })
  @Column({ type: 'varchar', length: 50 })
  lng: string;
}
