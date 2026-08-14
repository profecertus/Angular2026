import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CarritoService } from '../../shared/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CurrencyPipe
  ],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  readonly carrito = inject(CarritoService);
}
