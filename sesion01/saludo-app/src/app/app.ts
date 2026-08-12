import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LibroForm } from "../components/libro-form/libro-form";
import { Alerta } from "../components/alerta/alerta";
import { Badge } from "../components/badge/badge";

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, Alerta, Badge],
  templateUrl: './app.html'
})
export class App {
  segnalSalida = signal('SIN SEÑAL CARGADA');
  ver($event: string) {
    this.segnalSalida.set($event);    
  }

  protected readonly title = signal('saludo-app');

  
}
