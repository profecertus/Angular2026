import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Libro } from './libro.service';
import { Producto } from '../models/producto.model/producto.model';

@Injectable({ providedIn: 'root' })
export class AppDataService implements InMemoryDbService {
  createDb(): { libros: Libro[]; productos: Producto[] } {
    const libros: Libro[] = [
      { id: 1, titulo: 'Clean Code', disponible: true },
      { id: 2, titulo: 'New Developer', disponible: false },
      { id: 3, titulo: 'Refactoring', disponible: true },
      { id: 4, titulo: 'Domain Driver Design', disponible: true },
    ];

    const productos: Producto[] = [
      { id: 1, nombre: 'Café Premium', descripcion: 'Café de grano 100% arábica tostado medio', precio: 12.5, emoji: '☕' },
      { id: 2, nombre: 'Leche Entera', descripcion: 'Leche fresca pasteurizada 1 litro', precio: 3.8, emoji: '🥛' },
      { id: 3, nombre: 'Pan Artesanal', descripcion: 'Pan de masa madre recién horneado', precio: 5.0, emoji: '🍞' },
      { id: 4, nombre: 'Jugo de Naranja', descripcion: 'Jugo natural sin azúcar añadida 500ml', precio: 4.5, emoji: '🍊' },
      { id: 5, nombre: 'Chocolate Oscuro', descripcion: 'Tableta de chocolate 70% cacao 100g', precio: 6.9, emoji: '🍫' },
      { id: 6, nombre: 'Galletas Avena', descripcion: 'Galletas integrales con avena y miel', precio: 3.2, emoji: '🍪' },
    ];

    return { libros, productos };
  }
}
