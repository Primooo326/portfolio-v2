import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Proyecto } from '../../models/interfaces';

@Component({
  selector: 'app-card-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-proyecto.component.html',
  styleUrl: './card-proyecto.component.scss'
})
export class CardProyectoComponent implements OnInit {

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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const box: any = document.getElementById('animated-box')
    const animationClass = "motion-preset-slide-right"

    // Remove all existing motion- classes
    // const currentClasses = Array.from(box.classList)
    // const motionClasses = currentClasses.filter((className: any) => className.startsWith('motion-'))
    // motionClasses.forEach(className => box.classList.remove(className))

    // Temporarily remove the animation class to re-trigger it
    void box.offsetWidth // Trigger reflow to allow re-adding the class
    // box.classList.add(animationClass, 'motion-duration-1000')
  }

}
