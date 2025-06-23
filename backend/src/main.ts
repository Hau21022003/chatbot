import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
