import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(
    claveKey: string,
    confirmKey:string
): ValidatorFn{
    return (group:AbstractControl):ValidationErrors | null => {
        const clave = group.get(claveKey)?.value;
        const confirm = group.get(confirmKey)?.value;

        if (!confirm){
            return null;
        }

        return clave === confirm ? null:{ passwordMismatch: true};
    }
}