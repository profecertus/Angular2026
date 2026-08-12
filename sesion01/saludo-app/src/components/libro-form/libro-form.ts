import { Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Categoria {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-libro-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, CommonModule],
  templateUrl: './libro-form.html',
  styleUrl: './libro-form.css',
})
export class LibroForm {
  titulo = input('TITULO INICIAL');
  dato = signal('INICIADO');
  seleccionar = output<string>();

  elegir(){
    this.seleccionar.emit(this.titulo());
  }

  private fb = inject(FormBuilder);
  categorias: Categoria[] = [
    { id: 1, nombre: 'Ficción' },
    { id: 2, nombre: 'No Ficción' },
    { id: 3, nombre: 'Ciencia' },
    { id: 4, nombre: 'Historia' }
  ];
  
  form = this.fb.group({
    titulo: ['', Validators.required],
    categoria: [null, Validators.required]
  });

  setearSegnal(){
    this.dato.set('MODIFICADO');
  }
}
