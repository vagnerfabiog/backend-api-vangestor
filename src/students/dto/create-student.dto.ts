import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ResponsibleDto } from './responsible.dto';

export class CreateStudentDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsString()
  school!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  route?: string;

  @IsOptional()
  @IsString()
  shift?: string;

  @IsOptional()
  @IsNumber()
  monthlyFee?: number;

  @IsOptional()
  @IsNumber()
  paymentDay?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsDateString()
  contractStart?: string;

  @IsOptional()
  @IsDateString()
  contractEnd?: string;

  @IsOptional()
  @IsString()
  financialNotes?: string;

  @IsOptional()
  @IsString()
  generalNotes?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsString()
  driverId!: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponsibleDto)
  responsibles!: ResponsibleDto[];
}
