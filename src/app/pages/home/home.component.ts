import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProyectoComponent } from '../../components/card-proyecto/card-proyecto.component';
import { Proyecto } from '../../models/interfaces';
import { FooterComponent } from "../../components/footer/footer.component";
import { CardHerramientaComponent } from '../../components/card-herramienta/card-herramienta.component';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardProyectoComponent, FooterComponent, CardHerramientaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  proyectos: Proyecto[] = [
    {
      nombre: "Nexus Business TechAssessor",
      link: "https://nexus-business-techassesor.web.app/",
      icon: "https://nexus-business-techassesor.web.app/_astro/NBT.Dh4EQEsa_Z2funTE.svg",
      descripcion: "En Nexus Business TechAsesor, nos enfocamos en ayudar a las pequeñas y medianas empresas a mejorar su presencia en línea, aumentar sus ventas y optimizar sus operaciones mediante soluciones innovadoras y personalizadas.",
      tecnologias: [
        {
          link: "assets/icons/astro.svg",
          nombre: "Astro"
        },
        {
          link: "assets/icons/cloudflare.svg",
          nombre: "Cloudflare"
        },
      ]
    },
    {
      nombre: "Oberon 360",
      link: "https://dev.oberon360.com/auth",
      icon: "https://dev.oberon360.com/favicon.ico",
      descripcion: "Aplicativo web para la gestión de clientes, proveedores, productos, tracking de flotas, gestión de personal. Integrado con reconocimiento facial, gps, inteligencia artificial, analitica de datos, entre otros.",
      tecnologias: [
        {
          link: "assets/icons/nextjs.svg",
          nombre: "Next Js"
        },
        {
          link: "assets/icons/nestjs.svg",
          nombre: "Nest Js"
        },
        {
          link: "assets/icons/mssql.svg",
          nombre: "Microsoft SQL Server"
        },
        {
          link: "assets/icons/azure.svg",
          nombre: "Azure"
        },
        {
          link: "assets/icons/docker.svg",
          nombre: "Docker"
        },
      ]
    },
    {
      nombre: "Talento Tech Bogotá",
      link: "https://talentotechbogota.co/",
      icon: "https://talentotechbogota.co/images/TalentoTech.png",
      descripcion: "Un programa gubernamental de capacitación en habilidades digitales de vanguardia, tales como Programación Web Full Stack, Inteligencia Artificial, Blockchain, Análisis de Datos y Arquitectura en la Nube. Impulsamos tu empleabilidad y emprendimiento en el ámbito tecnológico, contribuyendo a cerrar la brecha digital en el país.",
      tecnologias: [
        {
          link: "assets/icons/nextjs.svg",
          nombre: "Next Js"
        },
        {
          link: "assets/icons/nodejs.svg",
          nombre: "Node Js"
        },
        {
          link: "assets/icons/mysql.svg",
          nombre: "MySql"
        },
      ]
    },
    {
      nombre: "Cursos Adobe",
      link: "https://cursosadobe.com",
      icon: "https://cursosadobe.com/assets/adobe.png",
      descripcion: "Una aplicación web que ofrece cursos de Adobe para empresas, con cuentas administrativas para la gestión de estudiantes y la opción de obtener certificaciones.",
      tecnologias: [
        {
          link: "assets/icons/angular.svg",
          nombre: "Angular"
        },
        {
          link: "assets/icons/nodejs.svg",
          nombre: "Node Js"
        },
        {
          link: "assets/icons/mysql.svg",
          nombre: "MySql"
        },
      ]
    },
    {
      nombre: "Visit Minca",
      link: "https://visitminca.co/",
      icon: "https://visitminca.co/wp-content/uploads/2022/04/Imagotipo-1-1.png",
      descripcion: "Una plataforma de turismo que te permite reservar hospedaje en varios hoteles, programar tours alrededor de Santa Marta - Minca y descubrir los mejores bares y restaurantes en la zona.",
      tecnologias: [
        {
          link: "assets/icons/wordpress.svg",
          nombre: "Wordpress"
        },
        {
          link: "assets/icons/mysql.svg",
          nombre: "MySql"
        },
      ]
    },
    {
      nombre: "Networking Miami",
      link: "https://networking.miami",
      icon: "https://networking.miami/media/logos-miami/logo-morado.png",
      descripcion: "Una red social sobre conectar personas dentro de Miami según sus intereses, idiomas, profesión y ubicación. Facilitando así conexiones valiosas y oportunidades de networking.",
      tecnologias: [
        {
          link: "assets/icons/angular.svg",
          nombre: "Angular"
        },
        {
          link: "assets/icons/nodejs.svg",
          nombre: "Node Js"
        },
        {
          link: "assets/icons/mysql.svg",
          nombre: "MySql"
        },
      ]
    },

  ]

  herramientas = [
    {
      nombre: "QR Code",
      descripcion: "Genera un QR Code dinámico con el contenido que desees.",
      handler: () => this.codeQr()
    },
    {
      nombre: "Redimensiona Imagenes",
      descripcion: "Reduce el peso de tus imagenes y ajusta la calidad según tus necesidades.",
      handler: () => { }
    },
    {
      nombre: "Descarga musica de Youtube",
      descripcion: "Descarga musica de Youtube en formato mp3.",
      handler: () => { }
    }
  ]

  interval = 0

  currentTab = signal('mis proyectos')

  constructor(private modalService: ModalService) {
    setInterval(() => {
      if (this.interval < 2) {
        this.interval++
      } else this.interval = 0
    }, 2500);

    this.codeQr()
  }

  changeTab(tab: string) {
    this.currentTab.set(tab)
  }

  codeQr() {
    this.modalService.open({
      title: 'QR Code Dinámico',
      component: QrCodeComponent,
      showFooter: true,
      confirmText: 'Guardar',
      cancelText: 'Cerrar',
      className: "w-[500px] max-w-[90%]"
    });
  }

}
