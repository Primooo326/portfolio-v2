import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProyectoComponent } from '../../components/card-proyecto/card-proyecto.component';
import { Proyecto } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardProyectoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  proyectos: Proyecto[] = [
    {
      nombre: "Networking Miami",
      link: "https://networking.miami",
      icon: "https://networking.miami/media/logos-miami/logo-morado.png",
      descripcion: "Una red social sobre conectar personas dentro de Miami según sus intereses, idiomas, profesión y ubicación. Facilitando así conexiones valiosas y oportunidades de networking.",
      tecnologias: [
        {
          link: "https://angular.dev/assets/icons/favicon-32x32.png",
          nombre: "Angular"
        },
        {
          link: "https://nodejs.org/static/images/favicons/favicon.png",
          nombre: "Node Js"
        },
        {
          link: "https://th.bing.com/th/id/R.bab2c760c60f17191cb3a002e08a3dbf?rik=yiOb%2bDZuARgRSw&riu=http%3a%2f%2fpngimg.com%2fuploads%2fmysql%2fmysql_PNG23.png&ehk=ughz54ymXwgnjlfws2xz7%2fznA2I4qAWExdUJe%2bcD7K0%3d&risl=&pid=ImgRaw&r=0",
          nombre: "MySql"
        },
      ]
    },
    {
      nombre: "Crusos Adobe",
      link: "https://cursosadobe.com",
      icon: "https://cursosadobe.com/assets/adobe.png",
      descripcion: "Una aplicación web que ofrece cursos de Adobe para empresas, con cuentas administrativas para la gestión de estudiantes y la opción de obtener certificaciones.",
      tecnologias: [
        {
          link: "https://angular.dev/assets/icons/favicon-32x32.png",
          nombre: "Angular"
        },
        {
          link: "https://nodejs.org/static/images/favicons/favicon.png",
          nombre: "Node Js"
        },
        {
          link: "https://th.bing.com/th/id/R.bab2c760c60f17191cb3a002e08a3dbf?rik=yiOb%2bDZuARgRSw&riu=http%3a%2f%2fpngimg.com%2fuploads%2fmysql%2fmysql_PNG23.png&ehk=ughz54ymXwgnjlfws2xz7%2fznA2I4qAWExdUJe%2bcD7K0%3d&risl=&pid=ImgRaw&r=0",
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
          link: "https://s1.wp.com/i/favicon.ico",
          nombre: "Wordpress"
        },
        {
          link: "https://th.bing.com/th/id/R.bab2c760c60f17191cb3a002e08a3dbf?rik=yiOb%2bDZuARgRSw&riu=http%3a%2f%2fpngimg.com%2fuploads%2fmysql%2fmysql_PNG23.png&ehk=ughz54ymXwgnjlfws2xz7%2fznA2I4qAWExdUJe%2bcD7K0%3d&risl=&pid=ImgRaw&r=0",
          nombre: "MySql"
        },
      ]
    },
  ]

  interval = 0

  constructor() {
    setInterval(() => {
      if (this.interval < 2) {
        this.interval++
      } else this.interval = 0
    }, 2500);
  }

}
