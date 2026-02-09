export class CreateDriverDto {
    name!: string;
    email?: string;
    phone!: string;
    password?: string;
    cnh!: string;
    cnhCategory!: string;
    cnhExpiration!: Date;
    active?: boolean;
}
