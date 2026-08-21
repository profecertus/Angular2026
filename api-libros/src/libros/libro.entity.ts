import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * ============================================================
 * ENTIDAD Libro — tabla 'libros' en SQLite
 * ============================================================
 * El contrato de campos coincide EXACTAMENTE con la interfaz
 * `Libro` del front (sesion7-app/src/app/libro.service.ts),
 * así el Angular no necesita cambios al pasar del backend
 * emulado (angular-in-memory-web-api) a esta API real.
 */
@Entity('libros')
export class Libro {
  /** PK autoincremental (equivalente a IDENTITY en H2). */
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  autor!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion!: string | null;

  @Column({ type: 'boolean', default: true })
  disponible!: boolean;

  /**
   * SQLite no tiene DECIMAL nativo: usamos REAL.
   * Se usa en el reto del PATCH parcial (actualizar solo el precio).
   */
  @Column({ type: 'real', default: 0 })
  precio!: number;
}
