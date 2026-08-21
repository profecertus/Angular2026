import { Component, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card',
  styleUrl: './card.css',
  templateUrl: './card.html',
})
export class Card {
  expandido = model(true);

  toggle():void{
    this.expandido.update((v) => !v);
  }
}
