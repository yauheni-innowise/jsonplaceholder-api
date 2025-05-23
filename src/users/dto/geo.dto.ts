import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for geographical coordinates
 */
export class GeoDto {
  @IsString()
  @IsNotEmpty()
  readonly lat: string;

  @IsString()
  @IsNotEmpty()
  readonly lng: string;
}
