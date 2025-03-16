import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { QrCodeComponent } from '../qr-code/qr-code.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  providers: [ModalService]
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

  constructor(private modalService: ModalService) {

  }

  codeQr() {
    this.modalService.open({
      title: 'QR Code Dinámico',
      component: QrCodeComponent,
      showFooter: true,
      confirmText: 'Guardar',
      cancelText: 'Cerrar'
    });
  }

}
