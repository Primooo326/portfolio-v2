import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {

  contacto = [
    {
      nombre: "Linkedin",
      link: "https://www.linkedin.com/in/juan-morales-dev/",
      icon: "fab fa-linkedin"
    },
    {
      nombre: "Github",
      link: "https://github.com/Primooo326",
      icon: "fab fa-github"
    },
    {
      nombre: "Instagram",
      link: "https://www.instagram.com/eskato.tsx/",
      icon: "fab fa-instagram"
    },
    {
      nombre: "Whatsapp",
      link: "https://wa.me/573046282936",
      icon: "fab fa-whatsapp"
    }

  ]

  herramientas = [
    {
      nombre: "QR Code",
      handler: () => this.codeQr()
    }
  ]

  constructor() {

  }

  codeQr() {
  }

}
