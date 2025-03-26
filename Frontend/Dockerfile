# Etap 1: Budowanie aplikacji Angular
FROM node:18 as build-stage

WORKDIR /app

# Kopiujemy tylko package.json i package-lock.json, aby zoptymalizować instalację zależności
COPY package*.json ./
RUN npm install

# Teraz kopiujemy resztę plików, ale bez node_modules (dzięki .dockerignore)
COPY . .
RUN npm run build --prod

# Etap 2: Serwowanie aplikacji przy użyciu Nginx
FROM nginx:latest as production-stage

COPY --from=build-stage /app/dist/szt/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]