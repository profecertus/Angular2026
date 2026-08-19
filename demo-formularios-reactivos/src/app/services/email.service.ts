import { HttpClient  } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

export interface ValidarEmailResponse{
    email:string;
    existe:boolean;
    mensaje:string;
}

export interface ValidarEmailError{
    statusCode: number;
    message: string[];
    error: string;
}

@Injectable({providedIn:'root'})
export class EmailService{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000/api/email/validar';

    validar(email: string): Observable<ValidarEmailResponse>{        
        return this.http.post<ValidarEmailResponse>(this.apiUrl, { email });
    }
}