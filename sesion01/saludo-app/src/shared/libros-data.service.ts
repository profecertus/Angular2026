import { InMemoryDbService, RequestInfo } from "angular-in-memory-web-api";
import { Libro } from "./libro.service";
import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class LibrosDataService implements InMemoryDbService{
    createDb(): { libros:Libro[]} {
        const libros: Libro[] =[
            {id:1, titulo:'Clean Code', disponible:true},
            {id:2, titulo:'New Developer', disponible:false},
            {id:3, titulo:'Refactoring', disponible:true},
            {id:4, titulo:'Domain Driver Design', disponible:true}
        ];
        return { libros }
    }    
}