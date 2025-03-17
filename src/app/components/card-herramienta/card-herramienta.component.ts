import { Component, Input, OnInit } from '@angular/core';
import { Herramienta } from '../../models/interfaces';

@Component({
  selector: 'app-card-herramienta',
  templateUrl: './card-herramienta.component.html',
  styleUrl: './card-herramienta.component.scss',
  standalone: true,
})
export class CardHerramientaComponent implements OnInit {

  @Input({ required: true }) herramienta!: Herramienta

  constructor() { }

  ngOnInit() {
  }

}
