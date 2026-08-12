import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncar',
})
export class TruncarPipe implements PipeTransform {
  transform(valor:string, max=20): string {
    return valor.length > max ? valor.slice(0, max) + '...': valor;
  }
}
