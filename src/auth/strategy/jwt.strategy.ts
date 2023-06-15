import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['token'];
          console.log('jwt from strategy', data);
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { userId: string; email: string }): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) throw new NotFoundException('User not Found');

    return user;
  }
}
