import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

/**
 * DTO de creación (POST /api/libros).
 * El `id` NO viene del cliente: lo genera la base de datos.
 *
 * La validación la aplica el ValidationPipe global (ver main.ts):
 * si el cuerpo no cumple, Nest responde 400 automáticamente.
 */
export class CrearLibroDto {
  @IsString()
  @MinLength(3, { message: 'El título necesita al menos 3 caracteres' })
  titulo!: string;

  @IsOptional()
  @IsString()
  autor?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;
}
