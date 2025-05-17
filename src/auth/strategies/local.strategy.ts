import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { AuthPayloadDto } from "../dtos/auth.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string) {
        const payload: AuthPayloadDto = { email, password } as AuthPayloadDto;
        const user = await this.authService.validateUser(payload);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}