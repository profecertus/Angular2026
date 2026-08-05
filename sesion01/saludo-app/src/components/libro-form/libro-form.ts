import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, Validators } from '@angular/forms';

interface Categoria {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-libro-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './libro-form.html',
  styleUrl: './libro-form.css',
})
export class LibroForm {
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
}
