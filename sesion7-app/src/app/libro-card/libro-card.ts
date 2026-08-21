import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Card } from '../card/card';
import { Libro } from '../services/libro.service';

@Component({
  imports: [Card, MatButtonModule],
  selector: 'app-libro-card',
  styleUrl: './libro-card.css',
  templateUrl: './libro-card.html',
})
export class LibroCard {
  libro = input.required<Libro>();

  destacado = input(false);

  seleccionar = output<Libro>();
  eliminar = output<Libro>();

  elegir():void{
    this.seleccionar.emit(this.libro());
  }

  quitar():void{
    this.eliminar.emit(this.libro());
  }
}
