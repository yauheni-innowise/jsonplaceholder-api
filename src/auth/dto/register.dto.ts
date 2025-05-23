import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration
 */
export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address for authentication' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'User password (minimum 8 characters)', 
    minLength: 8 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
