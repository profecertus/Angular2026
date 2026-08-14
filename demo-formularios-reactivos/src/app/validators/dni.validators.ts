import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function dniValidator():ValidatorFn{
    const regex = /^\d{8}$/;

    return (control: AbstractControl):ValidationErrors | null => {
        const valor = (control.value ?? '').toString().trim();

        if(valor === ''){
            return null;
        }

        return regex.test(valor)
            ? null
            :{dni:{mensaje:'El DNI debe tener exactamente 8 digitos'}};
    };
}