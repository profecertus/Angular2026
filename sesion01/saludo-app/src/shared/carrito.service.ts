import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito, Producto } from '../models/producto.model/producto.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  readonly totalPrecio = computed(() =>
    this._items().reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0)
  );

  agregar(producto: Producto): void {
    const items = this._items();
    const index = items.findIndex(i => i.producto.id === producto.id);

    if (index >= 0) {
      const updated = [...items];
      updated[index] = { ...updated[index], cantidad: updated[index].cantidad + 1 };
      this._items.set(updated);
    } else {
      this._items.set([...items, { producto, cantidad: 1 }]);
    }
  }

  quitar(productoId: number): void {
    const items = this._items();
    const index = items.findIndex(i => i.producto.id === productoId);

    if (index >= 0) {
      const item = items[index];
      if (item.cantidad > 1) {
        const updated = [...items];
        updated[index] = { ...updated[index], cantidad: updated[index].cantidad - 1 };
        this._items.set(updated);
      } else {
        this._items.set(items.filter(i => i.producto.id !== productoId));
      }
    }
  }

  cantidadDeProducto(productoId: number): number {
    const item = this._items().find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  vaciar(): void {
    this._items.set([]);
  }
}
