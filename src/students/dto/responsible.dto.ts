import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

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
}
