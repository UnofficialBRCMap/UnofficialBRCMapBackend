import {
  ForbiddenException,
  UnauthorizedException,
  HttpStatus,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { Token } from './dto/token.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<Token> {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        hash,
      },
    });

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const tokens = await this.generateTokens(payload);
    console.log('hhhhhhere tokens', tokens);

    return tokens;
  }

  async signin(dto: AuthDto): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    const payload = {
      userId: user.id,
      email: user.email,
    };

    const tokens = await this.generateTokens(payload);
    console.log('login here tokens', tokens);
    return tokens;
  }

  async refreshToken(token: string) {
    try {
      const { userId, email } = this.jwt.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const payload = {
        userId,
        email,
      };

      const tokens = await this.generateTokens(payload);
      console.log('refresh here tokens', tokens);
      return tokens;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async generateTokens(payload: { userId: string; email: string }): Promise<Token> {
    const refresh = await this.generateRefreshToken(payload);
    console.log('refresh', refresh);
    const access = await this.generateAccessToken(payload);
    const tokens = {
      accessToken: access,
      refreshToken: refresh,
    };
    console.log('inside generateTokens', tokens);
    return tokens;
  }

  async generateAccessToken(payload: { userId: string; email: string }): Promise<string> {
    return await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async generateRefreshToken(payload: {
    userId: string;
    email: string;
  }): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  async createForgottenPasswordToken(email: string): Promise<any> {
    console.log('inside createForgottenPasswordToken', email);
    const forgottenPassword = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (forgottenPassword?.resetPasswordExpires) {
      if (
        forgottenPassword?.resetPasswordToken &&
        (new Date().getTime() - forgottenPassword?.resetPasswordExpires.getTime()) /
          60000 <
          15
      ) {
        throw new HttpException(
          'RESET_PASSWORD.EMAIL_SENT_RECENTLY',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        const updatedUser = await this.prisma.user.update({
          where: {
            email: email.toLowerCase(),
          },
          data: {
            resetPasswordToken: (
              Math.floor(Math.random() * 9000000) + 1000000
            ).toString(), //Generate 7 digits number,
            resetPasswordExpires: new Date(),
          },
        });
        if (updatedUser) {
          return updatedUser;
        } else {
          throw new HttpException(
            'LOGIN.ERROR.GENERIC_ERROR',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } else {
      const updatedUser = await this.prisma.user.update({
        where: {
          email: email.toLowerCase(),
        },
        data: {
          resetPasswordToken: (Math.floor(Math.random() * 9000000) + 1000000).toString(), //Generate 7 digits number,
          resetPasswordExpires: new Date(),
        },
      });
      if (updatedUser) {
        return updatedUser;
      } else {
        throw new HttpException(
          'LOGIN.ERROR.GENERIC_ERROR',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getForgottenPasswordModel(newPasswordToken: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: newPasswordToken },
    });
    console.log(user);
    return user;
  }

  async sendEmailForgotPassword(email: string): Promise<any> {
    console.log('email', email.toLowerCase());
    const userFromDb = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    const tokenModel = await this.createForgottenPasswordToken(email.toLowerCase());
    console.log(tokenModel, tokenModel.resetPasswordToken);
    if (tokenModel && tokenModel.resetPasswordToken) {
      // const mail = {
      //   to: email.toLowerCase(),
      //   dynamic_template_data: {
      //     url: `${process.env.FRONTEND_URL}/reset?token=${tokenModel.resetPasswordToken}&email=${tokenModel.email}`,
      //     firstName: userFromDb.firstName,
      //     lastName: userFromDb.lastName,
      //   },
      //   template_id: process.env.SEND_GRID_FORGOT,
      //   subject: 'Hello from sendgrid',
      //   from: process.env.SEND_GRID_EMAIL, // Fill it with your validated email on SendGrid account
      // };

      // const sent = await this.sendgridService.send(mail);
      // console.log(sent);

      return true;
    } else {
      throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
    }
  }
}
