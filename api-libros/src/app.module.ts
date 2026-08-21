import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Libro } from './libros/libro.entity';
import { LibrosModule } from './libros/libros.module';

/**
 * ============================================================
 * PERSISTENCIA — SQLite embebida (el equivalente Node de H2)
 * ============================================================
 * H2 es una base de datos Java: no tiene driver para Node, así que
 * en NestJS el análogo directo es SQLite con `better-sqlite3`.
 *
 * Paralelo con H2:
 *   H2 en memoria   jdbc:h2:mem:testdb   ->  SQLite  ':memory:'
 *   H2 en archivo   jdbc:h2:./data/db    ->  SQLite  './libros.sqlite'
 *
 * Con ':memory:' la BD se crea vacía en cada arranque y `synchronize`
 * genera las tablas desde las entidades (como ddl-auto=create-drop).
 * Para conservar los datos entre reinicios, cambia `database` por
 * 'libros.sqlite'.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [Libro],
      // Crea el esquema desde las entidades. Solo para desarrollo/clase:
      // en producción se usan migraciones.
      synchronize: true,
      // Muestra el SQL en consola: útil para que los alumnos vean
      // qué genera TypeORM en cada operación del CRUD.
      logging: ['query', 'error'],
    }),
    LibrosModule,
  ],
})
export class AppModule {}
