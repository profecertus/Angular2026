import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, Observable, of } from "rxjs";

export interface Libro{
    id:number;
    titulo:string;
    disponible:boolean;
    autor?:string;
    descripcion?:string;
}

@Injectable({providedIn:'root'})
export class LibroService{
    private http = inject(HttpClient);
    private readonly url = environment.apiUrl + '/libros';

    getEndpoint():string{
        return this.url;
    }

    listar():Observable<Libro[]>{
        return this.http.get<Libro[]>(this.url);
    }

    buscar(termino:string):Observable<Libro[]>{
        return this.http.get<Libro[]>(this.url, {params:{titulo:termino}});
    }

    obtener(id:number):Observable<Libro>{
        return this.http.get<Libro>(`${this.url}/{id}`);
    }

    listarSeguro():Observable<Libro[]>{
        return this.http.get<Libro[]>(this.url).pipe(catchError(()=> of([])));
    }

    crear(dto: Omit<Libro, 'id'>):Observable<Libro>{
        return this.http.post<Libro>(this.url, dto);
    }

    actualizar(id:number, libro:Libro):Observable<Libro>{
        return this.http.put<Libro>(`${this.url}/{id}`, libro);
    }

    borrar(id:number):Observable<void>{
        return this.http.delete<void>(`${this.url}/{id}`)
    }
}