import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) { }

    async signUp(createUserDto: CreateUserDto) {
        const user = await this.usersService.createUser(createUserDto);


        return {
            // access_token: this.jwtService.sign(createUserDto),
            message: 'Signed Up Seuccessfully',
        }
    }

    async signIn(payload: UserDto) {
        const token = {
            sub: payload.id,
            username: payload.username,
            email: payload.email
        }
        const accessToken = await this.jwtService.signAsync(token);
        return { access_token: accessToken, userId: payload.id }
    }

    async authenticate(payload: AuthPayloadDto) {
        const user = await this.validateUser(payload);
        if (!user) throw new UnauthorizedException();
        return this.signIn(user);
    }

    async validateUser(payload: AuthPayloadDto): Promise<UserDto | null> {
        const user = await this.usersService.findUserByEmail(payload.email);

        if (user && await bcrypt.compare(payload.password, user.password)) {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
            };
        }

        return null;
    }
}
