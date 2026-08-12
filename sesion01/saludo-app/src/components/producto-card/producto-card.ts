import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../models/producto.model/producto.model';

@Component({
  selector: 'app-producto-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {
  readonly producto = input.required<Producto>();

  readonly enCarrito = input(0);

  readonly agregar = output<Producto>();

  onAgregar():void{
    this.agregar.emit(this.producto());
  }
}
