import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inscripcion } from "./inscripcion/inscripcion";

@Component({
  selector: 'app-root',
  imports: [Inscripcion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo-formularios-reactivos');
}
