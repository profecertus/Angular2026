import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Libro{
    id:number,
    titulo:string,
    disponible:boolean
}

@Injectable({providedIn:'root'})
export class LibroService {
    private http = inject(HttpClient);
    private readonly url = environment.apiUrl + '/libros';

    listar(): Observable<Libro[]>{
        console.log(this.url);
        return this.http.get<Libro[]>(this.url)
    }

}


