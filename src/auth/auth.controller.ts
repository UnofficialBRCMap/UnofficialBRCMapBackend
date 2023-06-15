import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { UserService } from '../user/user.service';
import { PasswordService } from './password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const jwt = await this.authService.signup(dto);
    console.log('jwt', jwt);
    response.cookie('refresh', jwt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    response.cookie('token', jwt.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
    response.statusCode = HttpStatus.OK;
    return 'success';
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    console.log('getting cookie', request.cookies['refresh']);
    const jwt = await this.authService.refreshToken(request.cookies['refresh']);
    console.log('jwt', jwt);
    response.cookie('refresh', jwt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    response.cookie('token', jwt.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    response.statusCode = HttpStatus.OK;
    return 'success';
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const jwt = await this.authService.signin(dto);
    console.log('jwt', jwt);
    response.cookie('refresh', jwt.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    response.cookie('token', jwt.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    response.statusCode = HttpStatus.OK;
    return 'success';
  }

  @Get('email/forgot-password/:email')
  public async sendEmailForgotPassword(@Param() params: any): Promise<IResponse> {
    try {
      const isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
      if (isEmailSent) {
        return new ResponseSuccess('LOGIN.EMAIL_RESENT', null);
      } else {
        return new ResponseError('REGISTRATION.ERROR.MAIL_NOT_SENT');
      }
    } catch (error) {
      return new ResponseError('LOGIN.ERROR.SEND_EMAIL', error);
    }
  }

  @Post('email/reset-password')
  @HttpCode(HttpStatus.OK)
  public async setNewPassord(
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<IResponse> {
    try {
      let isNewPasswordChanged = false;
      if (resetPassword.email && resetPassword.currentPassword) {
        const isValidPassword = await this.passwordService.validatePasswordWithEmail(
          resetPassword.email,
          resetPassword.currentPassword,
        );
        console.log('isValid', isValidPassword);
        if (isValidPassword) {
          isNewPasswordChanged = await this.userService.setPassword(
            resetPassword.email,
            resetPassword.newPassword,
          );
        } else {
          return new ResponseError('RESET_PASSWORD.WRONG_CURRENT_PASSWORD');
        }
      } else if (resetPassword.newPasswordToken) {
        const forgottenPasswordModel = await this.authService.getForgottenPasswordModel(
          resetPassword.newPasswordToken,
        );
        isNewPasswordChanged = await this.userService.setPassword(
          forgottenPasswordModel.email,
          resetPassword.newPassword,
        );
        if (isNewPasswordChanged)
          await this.userService.removePasswordToken(resetPassword.email);
      } else {
        return new ResponseError('RESET_PASSWORD.CHANGE_PASSWORD_ERROR');
      }
      return new ResponseSuccess('RESET_PASSWORD.PASSWORD_CHANGED', isNewPasswordChanged);
    } catch (error) {
      return new ResponseError('RESET_PASSWORD.CHANGE_PASSWORD_ERROR', error);
    }
  }
}
