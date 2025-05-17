import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'root@icarus',
        })
    }

    async validate(payload: any) {
        const user = await this.usersService.findUserByEmail(payload.email);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}