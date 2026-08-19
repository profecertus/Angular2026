import { inject } from "@angular/core";
import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors
} from '@angular/forms';
import {
    Observable,
    catchError,
    map,
    of,
    switchMap,
    timer
} from 'rxjs';
import { EmailService } from "../services/email.service";

export function emailDisponibleValidator(
    emailService: EmailService = inject(EmailService),
    debounceMs = 400
): AsyncValidatorFn{
    return (control:AbstractControl) : Observable<ValidationErrors | null> =>{
        const valor = (control.value ?? '').toString().trim();

        if(valor === ''){
            return of(null);
        }
        

        return timer(debounceMs).pipe(
            switchMap(()=> emailService.validar(valor)),
            map((res) =>                
                res.existe
                ? {                    
                    emailRegistrado:{
                        mensaje: res.mensaje || 'Este correo ya esta registrado'
                    }
                }
                : null
            ),
            catchError(() => of(null))
        );
    }
}