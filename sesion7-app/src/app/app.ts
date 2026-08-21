import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { Libro, LibroService } from './services/libro.service';
import { ContadorService } from './services/contador.service';
import { LibroCard } from "./libro-card/libro-card";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LibroCard
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private librosSrv = inject(LibroService);
  private contadorSrv = inject(ContadorService);

  endpointLibros = this.librosSrv.getEndpoint();
  segundos$ = this.contadorSrv.obtener();
  catalogo = signal<Libro[]>([]);
  seleccionado = signal<string>('');

  constructor(){
    this.librosSrv.listar().subscribe((libros) => this.catalogo.set(libros));
  }

  onVer(libro:Libro):void{
    this.seleccionado.set(`Seleccionaste: ${libro.titulo} (${libro.autor})`);
  }

  onEliminar(libro: Libro):void{
    this.catalogo.update((lista) => lista.filter((l) => l.id !== libro.id));
  }

  librosAgregados = signal<Libro[]>([]);

  onNuevoLibro(libro:Libro):void{
    this.catalogo.update((lista) => [...lista, libro]);
    this.librosAgregados.update((lista)=> [...lista, libro]);
  }
}
