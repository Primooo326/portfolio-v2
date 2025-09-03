import { Component } from '@angular/core';

interface ITimeline {
  title: string;
  fecha: string;
  description: string;
  proyectos: {
    nombre: string;
    link: string;
    icon: string;
    tecnologias: {
      nombre: string;
      link: string;
    }[];
  }[];
  color: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  standalone: true,
  imports: []
})
export class TimelineComponent {

  experiencias: ITimeline[] = [
    {
      title: 'THOMAS SEGURIDAD INTEGRAL',
      fecha: 'Abril 2024 - Actualidad',
      description: 'Participación en un ecosistema de software integral que incluye plataforma web, aplicaciones móviles, REST APIs e integraciones con IA, reconocimiento facial y GPS para la gestión de clientes, flotas y personal.',
      proyectos: [
        {
          nombre: 'Oberon 360',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'React', link: '' },
            { nombre: 'Next.js', link: '' },
            { nombre: 'Sql Server', link: '' },
            { nombre: 'Socket.IO', link: '' },
            { nombre: 'MongoDB', link: '' },
            { nombre: 'Azure', link: '' },
            { nombre: 'Docker', link: '' },
            { nombre: 'TailwindCSS', link: '' },
            { nombre: 'Nest.js', link: '' }
          ]
        }
      ],
      color: 'success',
    },
    {
      title: 'CYMETRIA Group',
      fecha: 'Feb 2023 - Abril 2024',
      description: 'Desarrollo de múltiples plataformas web, incluyendo un e-commerce, un portal de networking con chat en tiempo real y contribuciones a un programa de capacitación gubernamental.',
      proyectos: [
        {
          nombre: 'Cursosadobe.com',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'Angular +14', link: '' },
            { nombre: 'MySql', link: '' },
            { nombre: 'Express.js', link: '' },
            { nombre: 'GitHub Actions', link: '' }
          ]
        },
        {
          nombre: 'Networking.miami',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'Angular +14', link: '' },
            { nombre: 'MySql', link: '' },
            { nombre: 'Express.js', link: '' },
            { nombre: 'Socket.IO', link: '' },
            { nombre: 'GitHub Actions', link: '' }
          ]
        },
        {
          nombre: 'Talento Tech Bogotá',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'React', link: '' },
            { nombre: 'Next.js', link: '' },
            { nombre: 'Express', link: '' },
            { nombre: 'Socket.IO', link: '' },
            { nombre: 'MySql', link: '' },
            { nombre: 'TailwindCSS', link: '' },
            { nombre: 'GitHub Actions', link: '' }
          ]
        },
        {
          nombre: 'Visitminca.com',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'Wordpress', link: '' }
          ]
        }
      ],
      color: 'success',
    },
    {
      title: 'Infosol Colombia',
      fecha: 'Feb 2021 - Feb 2023',
      description: 'Diseño, creación y mantenimiento de plataformas de software para gestión administrativa y asambleas virtuales, incluyendo sus aplicaciones móviles asociadas.',
      proyectos: [
        {
          nombre: 'AdminOne.co',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'Angular +14', link: '' },
            { nombre: 'Firebase', link: '' }
          ]
        },
        {
          nombre: 'AsambleaVitual',
          link: '',
          icon: '',
          tecnologias: [
            { nombre: 'Angular +14', link: '' },
            { nombre: 'Ionic (Angular)', link: '' },
            { nombre: 'Firebase', link: '' }
          ]
        }
      ],
      color: 'success',
    }
  ];

  constructor() { }

}
