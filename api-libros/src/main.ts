import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Prefijo global: todas las rutas quedan bajo /api
  // -> http://localhost:8080/api/libros
  app.setGlobalPrefix('api');

  /**
   * CORS: el front (ng serve) corre en http://localhost:4200 y esta API
   * en el 8080. Son orígenes distintos, así que sin CORS el navegador
   * bloquearía las peticiones. Lo abrimos SOLO para el dev server.
   */
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  /**
   * ValidationPipe global: valida los DTOs con class-validator.
   *  - whitelist: descarta propiedades no declaradas en el DTO
   *  - forbidNonWhitelisted: responde 400 si mandan campos extra
   *  - transform: convierte tipos (ej. "99" -> 99) según el DTO
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const puerto = Number(process.env.PORT) || 8083;
  await app.listen(puerto);

  console.log(`\n  API de libros lista en http://localhost:${puerto}/api/libros`);
  console.log('  Persistencia: SQLite en memoria (se reinicia con el proceso)\n');
}

void bootstrap();
