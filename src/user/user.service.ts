import { BadRequestException, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PasswordService } from '../auth/password.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import { ChangePasswordInput } from './dto/change-password.input';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private passwordService: PasswordService) {}

  async exists(email: string) {
    console.log(email);
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return 'exists';
    } else {
      return null;
    }
  }

  async editUser(userId: string, dto: UserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return user;
  }

  async changeUserRole(userId: string, role: string): Promise<User> {
    let roleValue: Role;
    switch (role) {
      case 'admin':
        roleValue = Role.ADMIN;
        break;
      case 'user':
        roleValue = Role.USER;
        break;
      default:
        throw new BadRequestException('Improper Role');
    }

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: roleValue,
      },
    });

    return user;
  }

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    console.log('hashed password', hashedPassword, email);
    const userFromDb = await this.prisma.user.update({
      where: { email: email },
      data: {
        hash: hashedPassword,
      },
    });
    console.log(userFromDb.id);
    return true;
  }

  async removePasswordToken(email: string): Promise<boolean> {
    const userFromDb = await this.prisma.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    console.log(userFromDb.id);
    return true;
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    return this.prisma.user.update({
      data: {
        hash: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
