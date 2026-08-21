import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { Libro } from './libro.entity';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';

/**
 * Respuesta paginada. Coincide con la interfaz `Pagina<T>` del slide 24
 * del Módulo 7, para que el front la consuma tal cual:
 *   export interface Pagina<T> { content: T[]; total: number; }
 */
export interface Pagina<T> {
  content: T[];
  total: number;
  page: number;
  size: number;
}

@Injectable()
export class LibrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Libro)
    private readonly repo: Repository<Libro>,
  ) {}

  /**
   * Semilla inicial. La BD es en memoria: se recrea vacía en cada
   * arranque, así que sembramos los mismos datos que tenía el
   * backend emulado del front.
   */
  async onModuleInit(): Promise<void> {
    if ((await this.repo.count()) > 0) return;

    await this.repo.save([
      {
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        descripcion: 'Guía de artesanía de software y código legible.',
        disponible: true,
        precio: 129.9,
      },
      {
        titulo: 'El Programador Pragmático',
        autor: 'Hunt & Thomas',
        descripcion: 'Clásico sobre oficio, herramientas y pragmatismo.',
        disponible: true,
        precio: 149.0,
      },
      {
        titulo: 'Refactoring',
        autor: 'Martin Fowler',
        descripcion: 'Cómo mejorar el diseño del código existente.',
        disponible: false,
        precio: 189.5,
      },
      {
        titulo: 'Domain-Driven Design',
        autor: 'Eric Evans',
        descripcion: 'Modelar software alrededor del dominio del negocio.',
        disponible: true,
        precio: 210.0,
      },
      {
        titulo: 'Angular en Profundidad',
        autor: 'New Horizons',
        descripcion: 'Material del curso de Desarrollo Web con Angular.',
        disponible: true,
        precio: 99.0,
      },
    ]);
  }

  /**
   * Listado plano. Acepta filtro opcional por título
   * (GET /api/libros?titulo=clean), igual que hacía
   * angular-in-memory-web-api: contains, case-insensitive.
   *
   * Nota: usamos `Like` y no `ILike` porque `ILIKE` es sintaxis de
   * PostgreSQL; SQLite no la soporta. En SQLite `LIKE` ya es
   * case-insensitive para caracteres ASCII, así que el efecto es el mismo.
   */
  async listar(titulo?: string): Promise<Libro[]> {
    if (titulo?.trim()) {
      return this.repo.find({
        where: { titulo: Like(`%${titulo.trim()}%`) },
        order: { id: 'ASC' },
      });
    }
    return this.repo.find({ order: { id: 'ASC' } });
  }

  /**
   * Listado paginado (GET /api/libros?page=0&size=5).
   * Devuelve `content` + `total` para que el front calcule las páginas
   * o alimente un mat-paginator.
   */
  async listarPaginado(
    page: number,
    size: number,
    titulo?: string,
  ): Promise<Pagina<Libro>> {
    const where = titulo?.trim()
      ? { titulo: Like(`%${titulo.trim()}%`) }
      : {};

    const [content, total] = await this.repo.findAndCount({
      where,
      order: { id: 'ASC' },
      skip: page * size,
      take: size,
    });

    return { content, total, page, size };
  }

  /** GET por id. Si no existe -> 404 (el front lo ve como error HTTP). */
  async obtener(id: number): Promise<Libro> {
    const libro = await this.repo.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`No existe el libro con id ${id}`);
    }
    return libro;
  }

  /** POST — crear. Devuelve el recurso creado (con su id). */
  crear(dto: CrearLibroDto): Promise<Libro> {
    const libro = this.repo.create({
      titulo: dto.titulo,
      autor: dto.autor ?? null,
      descripcion: dto.descripcion ?? null,
      disponible: dto.disponible ?? true,
      precio: dto.precio ?? 0,
    });
    return this.repo.save(libro);
  }

  /**
   * PUT — reemplazo completo. Los campos que no vengan se resetean
   * a su valor por defecto (esa es la semántica de PUT).
   */
  async reemplazar(id: number, dto: ActualizarLibroDto): Promise<Libro> {
    await this.obtener(id); // valida existencia -> 404 si no está

    await this.repo.save({
      id,
      titulo: dto.titulo ?? '',
      autor: dto.autor ?? null,
      descripcion: dto.descripcion ?? null,
      disponible: dto.disponible ?? true,
      precio: dto.precio ?? 0,
    });

    return this.obtener(id);
  }

  /**
   * PATCH — actualización parcial. Solo toca los campos enviados.
   * Es lo que usa el reto "actualizar solo el precio": { "precio": 99 }
   */
  async actualizarParcial(
    id: number,
    dto: ActualizarLibroDto,
  ): Promise<Libro> {
    const libro = await this.obtener(id);
    Object.assign(libro, dto);
    return this.repo.save(libro);
  }

  /** DELETE — borrar. Responde 204 (sin cuerpo) desde el controlador. */
  async borrar(id: number): Promise<void> {
    const resultado = await this.repo.delete({ id });
    if (!resultado.affected) {
      throw new NotFoundException(`No existe el libro con id ${id}`);
    }
  }
}
