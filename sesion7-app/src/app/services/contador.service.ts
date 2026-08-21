import { Injectable } from "@angular/core";
import { interval, map, Observable } from "rxjs";

@Injectable({providedIn:'root'})
export class ContadorService{
    obtener():Observable<number>{
        return interval(1000).pipe(map((n) => n + 1));
    }
}