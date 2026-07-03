FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM node:20-alpine
RUN npm i -g serve
COPY --from=build /app/dist/portfolio/browser /app
EXPOSE 4200
CMD ["serve", "/app", "-l", "4200", "--single"]
