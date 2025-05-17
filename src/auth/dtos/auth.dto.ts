import { IsString, IsEmail } from 'class-validator';

export class AuthPayloadDto {
    id: string;

    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}