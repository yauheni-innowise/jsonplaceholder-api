import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for user company
 */
export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly catchPhrase: string;

  @IsString()
  @IsNotEmpty()
  readonly bs: string;
}
