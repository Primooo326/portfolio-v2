# Portfolio — primooo.dev

Portfolio personal desarrollado con **Angular 17**, **Tailwind CSS** y **FlyonUI**. Incluye herramientas útiles como descargador de YouTube, transcripción con Whisper, compresor de imágenes, calculadora de interés compuesto, generador QR, y más.

## Stack

| Capa        | Tecnología                        |
| ----------- | --------------------------------- |
| Frontend    | Angular 17, TypeScript, SCSS      |
| Estilos     | Tailwind CSS 3, FlyonUI           |
| Backend     | NestJS (repositorio separado)     |
| Hosting     | Docker + nginx + serve            |

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
                         docker-compose
  ┌──────────────────────────────────────────────┐
  │  portfolio-v2 (container)                    │
  │                                              │
  │  80  ──redirect 301──▶  443  ──proxy──▶  4200│
  │  (nginx)                (nginx)      (serve) │
  │                                │             │
  │        ┌───────────────────────┘             │
  │        ▼ proxy_pass /api/                    │
  │   youtube-downloader-app:3000                │
  │        (red interna Docker)                  │
  └──────────────────────────────────────────────┘
```

nginx recibe en 80/443 y proxy reverse al `serve` (puerto 4200) que sirve los estáticos de Angular. Las llamadas a `/api/*` se enrutan internamente al backend NestJS sin salir a internet.

### 1. Conectar el backend a la red interna

```bash
docker network connect portfolio-network youtube-downloader-app
```

### 2. Construir y levantar

```bash
docker compose up -d --build
```

### 3. Recarga automática de certificados

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
