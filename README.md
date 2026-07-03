# Portfolio — primooo.dev

Portfolio personal desarrollado con **Angular 17**, **Tailwind CSS** y **FlyonUI**. Incluye herramientas útiles como descargador de YouTube, transcripción con Whisper, compresor de imágenes, calculadora de interés compuesto, generador QR, y más.

## Stack

| Capa        | Tecnología                        |
| ----------- | --------------------------------- |
| Frontend    | Angular 17, TypeScript, SCSS      |
| Estilos     | Tailwind CSS 3, FlyonUI           |
| Backend     | NestJS (repositorio separado)     |
| Contenido   | Firebase Hosting / Docker + nginx |

## Desarrollo

```bash
ng serve
# http://localhost:4200/
```

## Build

```bash
ng build --configuration production
# salida: dist/portfolio/browser/
```

## Despliegue con Docker

### 1. Conectar el backend a la red interna

El contenedor `youtube-downloader-app` (backend NestJS, puerto 3000) debe estar en la misma red Docker para que nginx enrute las llamadas `/api/*` sin salir a internet.

```bash
docker network connect portfolio-network youtube-downloader-app
```

### 2. Construir y levantar

```bash
docker compose up -d --build
```

Esto expone `primooo.dev` en los puertos 80 y 443 con SSL vía Certbot.

### 3. Recarga automática de certificados

Para que nginx refleje los certificados renovados por Certbot:

```bash
echo 'docker exec portfolio-v2 nginx -s reload' | sudo tee /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
```

## Estructura del proyecto

```
src/
├── app/
│   ├── components/       # Componentes reutilizables
│   │   ├── card-herramienta/
│   │   ├── card-proyecto/
│   │   ├── compressor-img/
│   │   ├── footer/
│   │   ├── interes-compuesto/
│   │   ├── list-cleaner/
│   │   ├── modal/
│   │   ├── number-to-words/
│   │   ├── qr-code/
│   │   ├── timeline/
│   │   ├── whisper-transcribe/
│   │   └── youtube-downloader/
│   ├── pages/
│   │   └── home/         # Página principal (única ruta)
│   └── app.routes.ts     # Definición de rutas
├── environments/          # Configuración por entorno
└── index.html
```
