import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';

import { AuthModule } from './auth/auth.module';
import { LoggingInterceptor } from './common/logging.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CampModule } from './camp/camp.module';

const validationPipeOptions = {
  enableDebugMessages: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  whitelist: true,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UserModule,
    CampModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationPipeOptions),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
