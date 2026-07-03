FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.25-alpine
RUN apk add --no-cache nodejs npm
RUN npm i -g serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/portfolio/browser /app
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80 443 4200
ENTRYPOINT ["/entrypoint.sh"]
