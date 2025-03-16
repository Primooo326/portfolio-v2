import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FloatBarComponent } from './float-bar/float-bar.component';

@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [CommonModule, FloatBarComponent],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.scss'
})
export class QrComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
