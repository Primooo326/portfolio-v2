# Portfolio — primooo.dev

Portfolio personal desarrollado con **Angular 17**, **Tailwind CSS** y **FlyonUI**. Incluye herramientas útiles como descargador de YouTube, transcripción con Whisper, compresor de imágenes, calculadora de interés compuesto, generador QR, y más.

## Stack

| Capa        | Tecnología                        |
| ----------- | --------------------------------- |
| Frontend    | Angular 17, TypeScript, SCSS      |
| Estilos     | Tailwind CSS 3, FlyonUI           |
| Backend     | NestJS (repositorio separado)     |
| Hosting     | Docker + nginx host + serve       |

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

### Arquitectura

```
                            host
  ┌──────────────────────────────────────────────┐
  │  nginx (Certbot)   80 ──301──▶ 443           │
  │       │                       │              │
  │       └────── proxy ──────────┘              │
  │                  │                           │
  │           ┌──────┴──────┐                    │
  │           ▼             ▼                    │
  │     localhost:4200  localhost:3005           │
  │     (container)    (youtube-downloader-app)  │
  └──────────────────────────────────────────────┘
```

El **nginx del host** (con SSL de Certbot) recibe en 80/443 y proxy reverse al contenedor `portfolio-v2` (puerto 4200). Las llamadas a `/api/*` se enrutan a `localhost:3005` (backend NestJS), todo sin salir a internet.

### 1. Construir y levantar el contenedor

```bash
docker compose up -d --build
```

### 2. Configurar el host nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/primooo.dev
sudo ln -sf /etc/nginx/sites-available/primooo.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Recarga automática de certificados

Certbot recarga nginx automáticamente al renovar, no requiere configuración adicional.

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
