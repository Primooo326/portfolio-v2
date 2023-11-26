export interface Proyecto {
  nombre: string,
  link: string,
  icon: string
  descripcion: string,
  tecnologias: Tecnologia[]
}
export interface Tecnologia {
  link: string,
  nombre: string
}
