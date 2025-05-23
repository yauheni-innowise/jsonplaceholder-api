import { IsString, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { CompanyDto } from './company.dto';

/**
 * Data Transfer Object for updating an existing user
 * All fields are optional to allow partial updates
 */
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => AddressDto)
  readonly address?: AddressDto;

  @IsString()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly website?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => CompanyDto)
  readonly company?: CompanyDto;
}
