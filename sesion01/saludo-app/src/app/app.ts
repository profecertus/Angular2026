import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductoCard } from '../components/producto-card/producto-card';
import { Carrito } from '../components/carrito/carrito';
import { environment } from '../environments/environment';
import { Producto } from '../models/producto.model/producto.model';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ProductoCard,
    Carrito
  ],
  templateUrl: './app.html'
})
export class App {
  private productoSrv = inject(ProductoService);
  
  readonly carrito = inject(CarritoService);

  readonly env = environment;

  readonly productos = toSignal<Producto[]>(this.productoSrv.listar());

  onAgregar(producto:Producto):void{
    this.carrito.agregar(producto);
  }
}
