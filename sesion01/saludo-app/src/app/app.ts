import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { LibroService } from '../shared/libro.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('saludo-app');
  private librosSrv = inject(LibroService);
  libros$=this.librosSrv.listar();
}

