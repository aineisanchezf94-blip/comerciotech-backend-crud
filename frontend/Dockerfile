# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN CI=false npm run build


# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

# Instalar serve para servir la aplicación estática
RUN npm install -g serve

# Copiar archivos compilados desde el stage anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Servir la aplicación en el puerto 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
