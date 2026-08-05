import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Categoria{
  id:number;
  nombre:string;
}

@Component({
  selector: 'app-micomponente',
  imports: [MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './micomponente.html',
  styleUrl: './micomponente.css'
})
export class Micomponente {
  categorias: Categoria[] = [
    { id: 1, nombre: 'Categoria 1' },
    { id: 2, nombre: 'Categoria 2' },
    { id: 3, nombre: 'Categoria 3' }
  ];

  categoria:number | null = null;
}

