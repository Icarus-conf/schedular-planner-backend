import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/auth.guard';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        JwtModule.register({
            global: true,
            secret: 'root@icarus',
            signOptions: { expiresIn: '1h' }
        })],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {

}
