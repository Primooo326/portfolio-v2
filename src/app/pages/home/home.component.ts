import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProyectoComponent } from '../../components/card-proyecto/card-proyecto.component';
import { Proyecto } from '../../models/interfaces';
import { FooterComponent } from "../../components/footer/footer.component";
import { CardHerramientaComponent } from '../../components/card-herramienta/card-herramienta.component';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { CompressorImgComponent } from '../../components/compressor-img/compressor-img.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { InterestCalculatorComponent } from '../../components/interes-compuesto/interes-compuesto.component';
import { WhisperTranscribeComponent } from '../../components/whisper-transcribe/whisper-transcribe.component';
import { ListCleanerComponent } from '../../components/list-cleaner/list-cleaner.component';
import { NumberToWordsComponent } from '../../components/number-to-words/number-to-words.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardProyectoComponent,
    FooterComponent,
    CardHerramientaComponent,
    ModalComponent,
    CompressorImgComponent,
    QrCodeComponent,
    TimelineComponent,
    InterestCalculatorComponent,
    WhisperTranscribeComponent,
    ListCleanerComponent,
    NumberToWordsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  proyectos: Proyecto[] = [
    // Dentro de tu array proyectos: Proyecto[]
    {
      nombre: "Jitsi Streaming Cloud",
      link: "https://jitsi.primooo.dev",
      icon: "assets/icons/Logo_Jitsi.svg.png",
      descripcion: "Infraestructura privada de videoconferencias con escalabilidad para streaming profesional. Implementado con Jibri para retransmisión en vivo a YouTube/RTMP, configuración de Prosody para dominios internos y optimización de captura en modo Kiosko.",
      tecnologias: [
        { link: "assets/icons/docker.svg", nombre: "Docker & Compose" },
        { link: "assets/icons/linux.svg", nombre: "Ubuntu Server" },
        { link: "assets/icons/nginx.svg", nombre: "Nginx Reverse Proxy" },
        { link: "assets/icons/bash_dark.svg", nombre: "Shell Scripting" }
      ]
    },
    {
      nombre: "VROOM-OSRM Colombia",
      link: "https://osrm.primooo.dev",
      icon: "https://project-osrm.org/favicon.ico",
      descripcion: "Herramienta de logística y ruteo para Colombia. Calcula rutas óptimas, optimiza flotas de vehículos (VRP/TSP) y genera matrices de distancia con 5 perfiles vehiculares, desde motos hasta camiones pesados. Interfaz interactiva con mapas Leaflet, temas visuales y soporte multiidioma.",
      tecnologias: [
        {
          link: "assets/icons/react.svg",
          nombre: "React"
        },
        {
          link: "https://project-osrm.org/favicon.ico",
          nombre: "OSRM + VROOM"
        },
        {
          link: "assets/icons/docker.svg",
          nombre: "Docker"
        },
        {
          link: "assets/icons/linux.svg",
          nombre: "Linux"
        },
        {
          link: "assets/icons/nginx.svg",
          nombre: "Nginx"
        },
        { link: "assets/icons/bash_dark.svg", nombre: "Shell Scripting" }

      ]
    },
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
      ],
      noDisponible: true
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
      ],
      noDisponible: true
    },
    {
      nombre: "Fitnesspro",
      link: "https://fitnesspro-co.web.app/",
      icon: "https://fitnesspro-co.web.app/favicon.svg",
      descripcion: "FitnessPro es una página web diseñada para inspirar y guiar a las personas en su viaje hacia un estilo de vida más saludable y activo. Con un diseño moderno, oscuro and dinámico, esta plataforma ofrece una experiencia inmersiva para los amantes del fitness.",
      tecnologias: [
        {
          link: "assets/icons/astro.svg",
          nombre: "Astro"
        },
        {
          link: "assets/icons/cloudflare.svg",
          nombre: "Cloudflare"
        },
      ],
      noDisponible: true
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
      ],
      noDisponible: true
    },


  ]

  herramientas = [
    {
      nombre: "Genera código QR",
      descripcion: "Genera un QR Code dinámico con el contenido que desees.",
      handler: () => this.currentH.set("qr")
    },
    {
      nombre: "Comprime Imagenes",
      descripcion: "Reduce el peso de tus imagenes y ajusta la calidad según tus necesidades.",
      handler: () => this.currentH.set("compressor")
    },
    {
      nombre: "Interes Compuesto",
      descripcion: "Calcula el valor de un investimento en un periodo de tiempo con un interes anual.",
      handler: () => this.currentH.set("interes compuesto")
    },
    {
      nombre: "Transcripción de Audio",
      descripcion: "Sube varios archivos de audio y transcríbelos usando la API de Groq (Whisper).",
      handler: () => this.currentH.set("whisper-transcribe")
    },
    {
      nombre: "Depurador de Listas",
      descripcion: "Limpia espacios, elimina duplicados, ordena alfabéticamente y formatea listas de texto o Excel.",
      handler: () => this.currentH.set("list-cleaner")
    },
    {
      nombre: "Números a Letras",
      descripcion: "Convierte cifras numéricas a texto en español con formato personalizable para facturas y recibos.",
      handler: () => this.currentH.set("number-to-words")
    }
  ]

  interval = 0

  currentH = signal("");
  currentTab = signal('mis proyectos')

  constructor() {
    setInterval(() => {
      if (this.interval < 2) {
        this.interval++
      } else this.interval = 0
    }, 2500);
  }

  changeTab(tab: string) {
    this.currentTab.set(tab)
  }

}
