import { IsNotEmpty, IsString, IsPostalCode } from 'class-validator';

export class CreateSchoolDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    neighborhood!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsNotEmpty()
    @IsString()
    // @IsPostalCode('BR') // Optional: enforce format
    zipCode!: string;
}
