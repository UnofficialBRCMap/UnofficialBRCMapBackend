import { ClassSerializerInterceptor, Logger, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fs from 'fs';

import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma/prisma-exception.filter';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
    snapshot: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new PrismaClientExceptionFilter(app.get(HttpAdapterHost)));

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('Unofficial BRC Backend API')
    .setDescription('Unofficial BRC Backend API')
    .setVersion('1.0')
    .addTag('NestJs')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());

  // write swagger json to file
  fs.writeFileSync('./resources/swagger.json', JSON.stringify(document), {
    encoding: 'utf8',
    flag: 'w+',
  });

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`);
}
bootstrap();
