import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

interface Categoria{
  id:number;
  nombre:string;
}

@Component({
  selector: 'app-micomponente',
  imports: [MatSidenavModule, MatListModule],
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

