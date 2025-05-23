import { IsString, IsNotEmpty, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { CompanyDto } from './company.dto';

/**
 * Data Transfer Object for creating a new user
 */
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'johndoe', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'User address information' })
  @ValidateNested()
  @Type(() => AddressDto)
  readonly address: AddressDto;

  @ApiProperty({ example: '123-456-7890', description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ example: 'example.com', description: 'User website' })
  @IsString()
  @IsNotEmpty()
  readonly website: string;

  @ApiProperty({ description: 'User company information' })
  @ValidateNested()
  @Type(() => CompanyDto)
  readonly company: CompanyDto;
}
