import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { ResponsibleDto } from './responsible.dto';

// Address DTO for structured addresses
export class AddressDto {
  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsString()
  neighborhood!: string;

  @IsString()
  city!: string;

  @IsString()
  zipCode!: string;
}

// Emergency contact DTO
export class EmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;
}

// Authorized person DTO
export class AuthorizedPersonDto {
  @IsString()
  name!: string;

  @IsString()
  vehicle!: string;
}

export class CreateStudentDto {
  // Step 1: Basic Info
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
  shift?: string;

  @IsOptional()
  @IsString()
  photoUri?: string;

  @IsOptional()
  @IsString()
  entryTime?: string;

  @IsOptional()
  @IsString()
  exitTime?: string;

  @IsOptional()
  @IsString()
  vanPickupTime?: string;

  // Home address
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

  // Step 2: Responsibles
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponsibleDto)
  responsibles!: ResponsibleDto[];

  // Step 3: Logistics
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weekDays?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  pickupAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  dropoffAddress?: AddressDto;

  @IsOptional()
  @IsBoolean()
  canGoAlone?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorizedPersonDto)
  authorizedPerson?: AuthorizedPersonDto;

  // Step 4: Financial
  @IsOptional()
  @IsNumber()
  monthlyValue?: number;

  @IsOptional()
  @IsNumber()
  paymentDay?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  billingStartDate?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  financialObservations?: string;

  // Step 5: Health
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalRestrictions?: string[];

  @IsOptional()
  @IsString()
  healthPlan?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  contractUri?: string;

  // Legacy fields (optional, for backward compatibility)
  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsString()
  route?: string;
}
