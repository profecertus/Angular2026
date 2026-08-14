import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Producto } from '../models/producto.model/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private readonly url = environment.apiUrl + '/productos';

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }
}
