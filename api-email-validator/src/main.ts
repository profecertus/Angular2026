import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global: todos los endpoints quedan bajo /api
  app.setGlobalPrefix('api');

  // CORS abierto para que el front de Angular (localhost:4200) pueda consumirlo
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST'],
  });

  // Validación automática de los DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina props que no están en el DTO
      forbidNonWhitelisted: true, // 400 si mandan props extra
      transform: true, // castea tipos según el DTO
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API escuchando en http://localhost:${port}/api`);
}

bootstrap();
