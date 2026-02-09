import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsBoolean } from 'class-validator';

export class ResponsibleDto {
  @IsString()
  name!: string;

  @IsPhoneNumber('BR')
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  relation?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  isFinancial?: boolean;
}
