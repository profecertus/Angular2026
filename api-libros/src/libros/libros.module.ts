import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Libro } from './libro.entity';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';

/**
 * Módulo de la feature "libros".
 * `TypeOrmModule.forFeature` registra el Repository<Libro> que
 * inyectamos en el servicio con @InjectRepository.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  controllers: [LibrosController],
  providers: [LibrosService],
})
export class LibrosModule {}
