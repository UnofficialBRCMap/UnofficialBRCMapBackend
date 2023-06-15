import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserDto, UserEntity } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: User) {
    return new UserEntity(user);
  }

  @Get('/exists/:id')
  async exists(@Param('id') id: string) {
    return await this.userService.exists(id);
  }

  @UseGuards(JwtGuard)
  @Patch()
  async editUser(@GetUser('id') userId: string, @Body() dto: UserDto) {
    return new UserEntity(await this.userService.editUser(userId, dto));
  }
  @UseGuards(JwtGuard)
  @Patch('/role')
  async changeUserRole(@GetUser('id') userId: string, @Query('role') role: string) {
    const user = new UserEntity(await this.userService.changeUserRole(userId, role));
    console.log(user);
    return user;
  }
}
