import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { LibrosService, Pagina } from './libros.service';
import { Libro } from './libro.entity';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';

/**
 * ============================================================
 * CONTROLADOR — rutas bajo /api/libros
 * ============================================================
 * El prefijo global 'api' se define en main.ts, así que la ruta
 * completa queda: http://localhost:8080/api/libros
 *
 * Ese es exactamente el endpoint que el front espera en
 * environment.apiUrl ('http://localhost:8080/api') + '/libros'.
 */
@Controller('libros')
export class LibrosController {
  constructor(private readonly srv: LibrosService) {}

  /**
   * GET /api/libros
   *   -> Libro[]  (array plano, lo que consume el front hoy)
   *
   * GET /api/libros?titulo=clean
   *   -> Libro[]  filtrado (buscador con autocompletado)
   *
   * GET /api/libros?page=0&size=5
   *   -> Pagina<Libro> { content, total, page, size }
   *
   * Devolver array plano cuando NO hay paginación mantiene compatible
   * el código que ya escribimos en clase; el objeto paginado aparece
   * solo si mandas `page`. Así el mismo endpoint sirve para los dos casos.
   */
  @Get()
  listar(
    @Query('titulo') titulo?: string,
    @Query('page') page?: string,
    @Query('size', new DefaultValuePipe('5')) size?: string,
  ): Promise<Libro[] | Pagina<Libro>> {
    if (page !== undefined) {
      return this.srv.listarPaginado(
        Math.max(0, Number(page) || 0),
        Math.max(1, Number(size) || 5),
        titulo,
      );
    }
    return this.srv.listar(titulo);
  }

  /** GET /api/libros/:id  -> Libro (404 si no existe). */
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.srv.obtener(id);
  }

  /** POST /api/libros -> 201 + el libro creado. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearLibroDto): Promise<Libro> {
    return this.srv.crear(dto);
  }

  /** PUT /api/libros/:id -> reemplazo completo. */
  @Put(':id')
  reemplazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarLibroDto,
  ): Promise<Libro> {
    return this.srv.reemplazar(id, dto);
  }

  /** PATCH /api/libros/:id -> parcial, ej. { "precio": 99 }. */
  @Patch(':id')
  actualizarParcial(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarLibroDto,
  ): Promise<Libro> {
    return this.srv.actualizarParcial(id, dto);
  }

  /** DELETE /api/libros/:id -> 204 sin cuerpo (coincide con delete<void>). */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  borrar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.srv.borrar(id);
  }
}
