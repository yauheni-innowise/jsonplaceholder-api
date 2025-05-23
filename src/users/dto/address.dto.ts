import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GeoDto } from './geo.dto';

/**
 * Data Transfer Object for user address
 */
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  readonly street: string;

  @IsString()
  @IsNotEmpty()
  readonly suite: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly zipcode: string;

  @ValidateNested()
  @Type(() => GeoDto)
  readonly geo: GeoDto;
}
