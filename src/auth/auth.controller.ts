import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth.guard';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';



@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(LocalGuard)
    login(@Request() req) {
        return this.authService.signIn(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getUserInfo(@Request() req) {
        return req.user;
    }

}
