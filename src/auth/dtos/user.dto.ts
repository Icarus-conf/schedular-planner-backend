import { IsString, IsEmail } from 'class-validator';


export class UserDto {
    id: string;

    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    email: string;
}