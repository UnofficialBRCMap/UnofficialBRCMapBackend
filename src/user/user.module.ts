import { Module } from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordService],
})
export class UserModule {}
