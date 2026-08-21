import { PartialType } from '@nestjs/mapped-types';
import { CrearLibroDto } from './crear-libro.dto';

/**
 * DTO de actualización.
 * `PartialType` vuelve opcionales TODOS los campos de CrearLibroDto,
 * así el mismo DTO sirve para:
 *   - PUT   /api/libros/:id  (reemplazo completo)
 *   - PATCH /api/libros/:id  (actualización parcial, ej. solo el precio)
 */
export class ActualizarLibroDto extends PartialType(CrearLibroDto) {}
