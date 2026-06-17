export interface Proyecto {
  nombre: string,
  link: string,
  icon: string
  descripcion: string,
  tecnologias: Tecnologia[],
  noDisponible?: boolean
}
export interface Tecnologia {
  link: string,
  nombre: string
}

export interface Herramienta {
  nombre: string,
  descripcion: string,
  handler: () => void
}
