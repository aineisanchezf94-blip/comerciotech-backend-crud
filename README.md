# ComercioTech - Backend CRUD

Este proyecto consiste en una API robusta, segura y escalable para gestionar los datos de clientes, productos y pedidos de la empresa *ComercioTech*.

## Tecnologías Utilizadas
* **Node.js** (Entorno de ejecución)
* **Express** (Framework de servidor)
* **MongoDB** (Base de datos NoSQL)
* **Mongoose** (Modelado de datos)
* **React + Vite** (Frontend)
* **Docker & Docker Compose** (Orquestación de contenedores)

## Estructura del Proyecto
```
├── docker-compose.yml       # Orquestación de MongoDB, Backend y Frontend
├── .env.example             # Plantilla de variables de entorno para el equipo
├── .gitignore               # Archivos excluidos del repositorio global
├── README.md                # Este archivo
├── frontend/                # Aplicación de interfaz visual (React + Vite + Axios)
│   ├── Dockerfile           # Imagen del frontend
│   └── src/
│       └── api/
│           └── axios.js     # Configuración de cliente HTTP
└── backend/                 # API REST del Servidor (Node.js + Express + Mongoose)
    ├── Dockerfile           # Imagen del backend
    ├── package.json         # Dependencias y scripts de arranque del servidor
    └── src/
        ├── server.js        # Punto de entrada de la aplicación y puerto 5001
        ├── seed.js          # Script para insertar datos de ejemplo
        ├── config/
        │   └── db.js        # Lógica de conexión a MongoDB
        ├── models/          # Modelos NoSQL (Client.js, Product.js, Order.js)
        ├── controllers/     # Lógica CRUD (clientController.js, etc.)
        └── routes/          # Endpoints HTTP (clientRoutes.js, etc.)
```

## 🚀 Instalación Rápida con Docker (Recomendado)

### Requisitos previos
- Docker: https://www.docker.com/products/docker-desktop
- Docker Compose (incluido en Docker Desktop)

### Pasos para ejecutar con Docker

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/aineisanchezf94-blip/comerciotech-backend-crud
   cd comerciotech-backend-crud
   ```

2. **Iniciar todos los servicios:**
   ```bash
   docker-compose up --build
   ```
   Esto levantará:
   - **MongoDB** en `localhost:27017`
   - **Backend** en `http://localhost:5001`
   - **Frontend** en `http://localhost:3000`

3. **Ver los servicios en ejecución:**
   ```bash
   docker-compose ps
   ```

4. **Insertar datos de ejemplo (en otra terminal):**
   ```bash
   docker-compose exec backend npm run seed
   ```

5. **Detener los servicios:**
   ```bash
   docker-compose down
   ```

6. **Detener y eliminar volúmenes (datos):**
   ```bash
   docker-compose down -v
   ```

### URLs de acceso con Docker:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health
- **MongoDB:** localhost:27017 (internamente: `mongodb://mongo:27017/comerciotech`)

---

## 🛠️ Instalación Local (Sin Docker)

### Requisitos previos
- Node.js 20+ (https://nodejs.org/)
- MongoDB Community Edition (https://www.mongodb.com/try/download/community)

### Backend

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/aineisanchezf94-blip/comerciotech-backend-crud
   cd comerciotech-backend-crud/backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # Copiar plantilla
   cp .env.example .env
   
   # Editar .env y establecer:
   # Para desarrollo local:
   # MONGO_URI=mongodb://localhost:27017/comerciotech
   # Para MongoDB Atlas (producción):
   # MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/comerciotech
   ```

4. **Correr el servidor en desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:5001`

5. **Insertar datos de ejemplo:**
   ```bash
   npm run seed
   ```

### Frontend

1. **En otra terminal, ir a la carpeta frontend:**
   ```bash
   cd comerciotech-backend-crud/frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Correr en desarrollo:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

---

## 📚 Endpoints disponibles

### Clientes
- `GET /api/clients` - Obtener todos los clientes
- `GET /api/clients/:id` - Obtener un cliente por ID
- `POST /api/clients` - Crear un nuevo cliente
- `PUT /api/clients/:id` - Actualizar un cliente
- `DELETE /api/clients/:id` - Eliminar un cliente

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:id` - Actualizar un producto
- `DELETE /api/products/:id` - Eliminar un producto

### Órdenes
- `GET /api/orders` - Obtener todas las órdenes
- `GET /api/orders/:id` - Obtener una orden por ID
- `POST /api/orders` - Crear una nueva orden
- `PUT /api/orders/:id` - Actualizar una orden
- `DELETE /api/orders/:id` - Eliminar una orden

---

## 🧪 Testing

### Con Docker:
```bash
# Verificar health del backend
curl http://localhost:5001/api/health

# Obtener todos los clientes
curl http://localhost:5001/api/clients

# Crear un cliente
curl -X POST http://localhost:5001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@example.com","phone":"123456","address":"Calle 1"}'
```

---

## 📖 Documentación adicional

Consulta la carpeta `docs/` para más información:
- `01-Requisitos-Negocio.md` - Requisitos funcionales y no funcionales
- `02-Justificacion-SO.md` - Justificación del Sistema Operativo
- `03-Guia-Configuracion-SO.md` - Guía de configuración del SO
- `04-Guia-Instalacion-MongoDB.md` - Instalación de MongoDB
- `05-Esquema-Base-Datos.md` - Esquema de la base de datos
- `06-Codigo-Conex-Crud.md` - Código de conexión y CRUD

---

## 🐛 Solución de problemas

### MongoDB no conecta
- Verificar que MongoDB esté corriendo: `docker-compose ps`
- Ver logs: `docker-compose logs mongo`
- Esperar a que MongoDB inicie (puede tardar unos segundos)

### Backend no conecta a MongoDB
- Ver logs del backend: `docker-compose logs backend`
- Verificar variable `MONGO_URI` en docker-compose.yml

### Frontend no carga
- Ver logs: `docker-compose logs frontend`
- Verificar que el backend está corriendo en `http://localhost:5001`

### Puerto ya en uso
```bash
# Cambiar puerto en docker-compose.yml, ej: "8000:5001" para el backend
# O encontrar y matar el proceso:
# macOS/Linux:
lsof -i :5001
kill -9 <PID>
```

---

## 📝 Notas de desarrollo

- Los datos en Docker se persisten en un volumen `mongo-data`
- El código de backend y frontend se vincula con volúmenes, así que los cambios se reflejan sin necesidad de reconstruir
- El frontend en desarrollo se comunica con el backend via `http://localhost:5001/api`
- En producción, configurar CORS y variables de entorno apropiadamente

---

## 👥 Contribuciones

Para colaborar en el proyecto, crear un branch, hacer cambios y abrir un Pull Request.
