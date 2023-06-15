import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await argon.verify(password, hashedPassword);
  }

  async validatePasswordWithEmail(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      const isValidPassword = await this.validatePassword(user.hash, password);
      return isValidPassword;
    } else {
      return false;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }
}
