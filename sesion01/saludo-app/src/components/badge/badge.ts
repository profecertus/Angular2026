import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  host:{'[class.activo]' : 'activo()'},
  styleUrl: './badge.css',
})
export class Badge {
  activo = signal(true);
}
