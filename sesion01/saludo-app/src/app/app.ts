import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Micomponente } from '../components/micomponente/micomponente';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, Micomponente],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('saludo-app');
}
