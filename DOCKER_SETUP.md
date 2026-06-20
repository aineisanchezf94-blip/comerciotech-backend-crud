# Guía de Docker - ComercioTech

Documento detallado sobre la configuración y uso de Docker en ComercioTech.

## 📋 Contenido

1. [Estructura de Docker](#estructura-de-docker)
2. [Imagen del Backend](#imagen-del-backend)
3. [Imagen del Frontend](#imagen-del-frontend)
4. [Orquestación con Docker Compose](#orquestación-con-docker-compose)
5. [Inicio Rápido](#inicio-rápido)
6. [Comandos Útiles](#comandos-útiles)
7. [Troubleshooting](#troubleshooting)

---

## Estructura de Docker

El proyecto utiliza 3 contenedores:

### 1. **MongoDB** (mongo:6.0)
- Imagen oficial de MongoDB Community Edition 6.0
- Puerto: 27017 (expuesto localmente)
- Volumen: `mongo-data` (persiste datos entre reinicios)
- Health Check: Verifica que MongoDB responda a pings

### 2. **Backend** (Node.js + Express)
- Imagen personalizada basada en `node:20-alpine`
- Puerto: 5001
- Conecta a MongoDB via `mongodb://mongo:27017/comerciotech`
- Volumen: `./backend:/usr/src/app` (código en vivo)
- Depende de: MongoDB

### 3. **Frontend** (React + Vite)
- Imagen personalizada con multi-stage build
  - Stage 1: Compila la app con `npm run build`
  - Stage 2: Sirve archivos estáticos con `serve`
- Puerto: 3000
- Depende de: Backend

---

## Imagen del Backend

### Dockerfile del Backend
```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "docker:start"]
```

### Puntos importantes:
- Usa Alpine Linux (ligero, ~170MB vs 1GB de la imagen completa)
- No requiere compilación, Node.js interpreta JavaScript directamente
- El comando `docker:start` ejecuta `node src/server.js`
- COPY de package.json antes del código permite cachéing de dependencias

---

## Imagen del Frontend

### Dockerfile del Frontend
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Puntos importantes:
- **Multi-stage build**: 
  - Stage 1 compila la app (~500MB temporal)
  - Stage 2 solo copia el directorio `dist` compilado (~5MB)
  - Resultado final: imagen ligera y optimizada
- Usa `serve` para servir archivos estáticos con compresión y caché
- El frontend compilado se sirve en puerto 3000

---

## Orquestación con Docker Compose

### docker-compose.yml
Define 3 servicios, volúmenes y una red:

```yaml
services:
  mongo:
    image: mongo:6.0
    restart: unless-stopped
    container_name: comerciotech-mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: comerciotech
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: comerciotech-backend
    working_dir: /usr/src/app
    command: npm run docker:start
    ports:
      - '5001:5001'
    environment:
      MONGO_URI: mongodb://mongo:27017/comerciotech
      PORT: 5001
      NODE_ENV: development
    depends_on:
      mongo:
        condition: service_healthy
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    networks:
      - comerciotech-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: comerciotech-frontend
    ports:
      - '3000:3000'
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src
    networks:
      - comerciotech-network

volumes:
  mongo-data:

networks:
  comerciotech-network:
    driver: bridge
```

### Explicación de configuraciones:

- **restart: unless-stopped** - Reinicia automáticamente si se cae (excepto si se detiene manualmente)
- **healthcheck** - Verifica que MongoDB esté listo antes de que backend intente conectar
- **depends_on** - Garantiza orden de inicio (pero healthcheck fuerza espera real)
- **volumes** - Persisten datos y sincroniza código para desarrollo
- **networks** - Los contenedores se comunican por nombre (ej: `mongodb://mongo:27017`)
- **environment** - Variables disponibles dentro del contenedor

---

## Inicio Rápido

### Opción 1: Script automático
```bash
cd comerciotech-backend-crud
./start-docker.sh
```

### Opción 2: Comandos manuales
```bash
# Construir imágenes y levantar servicios
docker-compose up --build

# En otra terminal, insertar datos de ejemplo
docker-compose exec backend npm run seed
```

### Acceso a los servicios:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- MongoDB: localhost:27017

---

## Comandos Útiles

### Ver estado de servicios
```bash
docker-compose ps
```

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo del backend
docker-compose logs -f backend

# Solo de MongoDB
docker-compose logs -f mongo
```

### Ejecutar comandos dentro de un contenedor
```bash
# En el backend
docker-compose exec backend npm run seed
docker-compose exec backend npm test
docker-compose exec backend sh  # shell interactivo

# En MongoDB
docker-compose exec mongo mongosh  # MongoDB shell
```

### Detener servicios
```bash
# Detener sin eliminar datos
docker-compose down

# Detener y eliminar volúmenes (borra BD)
docker-compose down -v

# Detener un servicio específico
docker-compose stop backend
```

### Reconstruir imágenes
```bash
# Reconstruir solo el backend
docker-compose up --build backend

# Reconstruir y sin usar caché
docker-compose up --build --no-cache
```

### Limpiar espacio
```bash
# Eliminar contenedores parados
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar todo (contenedores, redes, volúmenes no usados)
docker system prune -a --volumes
```

---

## Troubleshooting

### 1. Puerto ya en uso
**Error:** `docker: Error response from daemon: driver failed programming external connectivity on endpoint...`

**Solución:**
```bash
# Encontrar proceso usando el puerto
lsof -i :5001  # macOS/Linux
netstat -ano | findstr :5001  # Windows

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en docker-compose.yml
# "8000:5001" en lugar de "5001:5001"
```

### 2. MongoDB no conecta
**Error:** `getaddrinfo ENOTFOUND mongo`

**Causas comunes:**
- MongoDB no ha terminado de iniciar (espera 10-15 segundos)
- Red de Docker no configurada

**Solución:**
```bash
# Verificar estado de MongoDB
docker-compose logs mongo

# Reiniciar contenedor de MongoDB
docker-compose restart mongo

# Reconstruir todo
docker-compose down -v
docker-compose up --build
```

### 3. Frontend no carga datos
**Error:** CORS error o 404 en requests al backend

**Causas:**
- Backend no está corriendo
- Frontend apunta a URL incorrecta (`http://localhost:5001`)
- Firewall bloqueando conexión

**Solución:**
```bash
# Verificar que backend está corriendo
docker-compose ps backend

# Ver logs del backend
docker-compose logs backend

# Verificar endpoint de health
curl http://localhost:5001/api/health
```

### 4. Cambios en código no se reflejan
**Problema:** Modificas archivos pero no ves cambios

**Causa:** Volúmenes no está sincronizando correctamente

**Solución:**
```bash
# Reconstruir imagen
docker-compose up --build backend

# O usar watch para development
docker-compose up --watch
```

### 5. Espacio en disco
**Problema:** Docker consume mucho espacio

**Solución:**
```bash
# Limpiar volúmenes huérfanos
docker volume prune

# Ver tamaño de volúmenes
docker system df

# Eliminar volumen específico
docker volume rm commerciotech-mongo-data
```

### 6. Problemas de permisos
**Error:** `permission denied` al escribir en volumen

**Solución:** En macOS/Linux, los permisos de Docker generalmente no son problema. Si ocurre:
```bash
# Revisar propiedad de archivos
ls -la backend/

# Cambiar permisos si es necesario
chmod -R 755 backend/
```

---

## Variables de Entorno

### Backend (.env)
```
PORT=5001
MONGO_URI=mongodb://mongo:27017/comerciotech
NODE_ENV=development
```

### Para producción
```
PORT=5001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/comerciotech
NODE_ENV=production
```

---

## Notas de Seguridad para Producción

1. **No exponer MongoDB directamente a Internet**
   - Usar VPC o red privada en cloud
   - Configurar firewall para solo aceptar desde backend

2. **Habilitar autenticación en MongoDB**
   ```yaml
   environment:
     MONGO_INITDB_ROOT_USERNAME: admin
     MONGO_INITDB_ROOT_PASSWORD: strong_password
   ```

3. **Usar TLS/SSL**
   - Generar certificados
   - Configurar en docker-compose.yml

4. **Variabl de entorno seguras**
   - No hardcodear credenciales
   - Usar `.env.production` para secretos
   - En Docker Swarm/Kubernetes, usar Secrets

5. **Límites de recursos**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

---

## Referencias

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- MongoDB Docker Hub: https://hub.docker.com/_/mongo
- Node.js Docker Hub: https://hub.docker.com/_/node
