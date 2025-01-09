import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

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
  register(@Body() body: AuthDTO) {
    return this.authService.register(body);
  }
  @Post('login')
  login(@Req() req) {
    console.log(req.body);
    return this.authService.login(req.body);
  }
}
