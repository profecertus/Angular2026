import { Component } from '@angular/core';
import { TruncarPipe } from '../../shared/truncar-pipe';

@Component({
  selector: 'app-alerta',
  imports: [TruncarPipe],
  templateUrl: './alerta.html',
  styleUrl: './alerta.css',
})
export class Alerta {}
