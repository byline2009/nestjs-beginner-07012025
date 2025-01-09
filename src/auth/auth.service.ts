import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,

    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  doSomething() {
    console.log('dosome thing');
  }
  async register(authDTO: AuthDTO) {
    const hashedpassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedpassword,
          firstName: authDTO.firstName,
          lastName: authDTO.lastName,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      return user;
    } catch (error) {
      console.log('error', error);
      if (error.code == 'P2002') {
        throw new ForbiddenException(error.message);
      }
    }
  }
  async login(authDTO: any) {
    const user = await this.prismaService.user.findUnique({
      where: { email: authDTO.email },
    });
    if (!user) {
      throw new ForbiddenException('user not found');
    }
    const passwordMatched = await argon.verify(
      user.hashedPassword,
      authDTO.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('incorrect password');
    }
    delete user.hashedPassword;
    return await this.convertoJwtString(user.id, user.email);
  }
  async convertoJwtString(userId: number, email: string): Promise<any> {
    const payload = {
      sub: userId,
      email,
    };
    const expiresIn = 60 * 60;

    const jwtString = await this.jwtService.signAsync(
      payload,
      /* user.secret ,*/
      { expiresIn, secret: this.configService.get('JWT_SECRET') },
    );
    return { accessToken: jwtString };
  }
}
