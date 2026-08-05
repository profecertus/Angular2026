import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { LibroService } from '../shared/libro.service';
import { Micomponente } from '../components/micomponente/micomponente';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Micomponente],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('saludo-app');
  private librosSrv = inject(LibroService);
  libros$=this.librosSrv.listar();
}

