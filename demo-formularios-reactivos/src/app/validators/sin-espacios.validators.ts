import { AbstractControl, ValidationErrors } from "@angular/forms";

export function sinEspacios(c: AbstractControl):ValidationErrors | null {
    const v = (c.value ?? '') as string;
    return v.includes(' ') ? {sinEspacios:true}: null;
}