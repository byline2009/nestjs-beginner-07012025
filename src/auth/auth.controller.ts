import { Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    authService.doSomething();
  }
  @Get()
  helloworld() {
    return { message: 'hello world' };
  }
  @Post('register')
  register(@Req() req) {
    console.log(req.body);
    return { message: 'hello' };
  }
  @Post('login')
  login(@Req() req) {
    console.log(req.body);
    return { message: 'login' };
  }
}
