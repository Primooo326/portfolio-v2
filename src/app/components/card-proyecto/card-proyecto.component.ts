import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Proyecto } from '../../models/interfaces';

@Component({
  selector: 'app-card-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-proyecto.component.html',
  styleUrl: './card-proyecto.component.scss'
})
export class CardProyectoComponent {

  @Input({ required: true }) proyecto!: Proyecto

  interval = 0

  constructor() {
    setInterval(() => {

      if (this.interval <= this.proyecto.tecnologias.length) {
        this.interval++
      } else {
        this.interval = 0
      }

    }, 2000);
  }

}
