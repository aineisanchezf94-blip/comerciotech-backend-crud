# comerciotech-backend-crud
Proyecto ComercioTech para manejar de manera masiva cantidades de clientes y transacciones.

# ComercioTech - Backend CRUD

Este proyecto consiste en una API robusta, segura y escalable para gestionar los datos de clientes, productos y pedidos de la empresa *ComercioTech*.

## Tecnologías Utilizadas
* **Node.js** (Entorno de ejecución)
* **Express** (Framework de servidor)
* **MongoDB** (Base de datos NoSQL)
* **Mongoose** (Modelado de datos)

## 📂 Estructura del Proyecto
```text
├── .env.example             # Plantilla de variables de entorno
├── .gitignore               # Archivos excluidos de Git
├── README.md                # Instrucciones del proyecto
├── package.json             # Dependencias del proyecto
└── src/
    ├── server.js            # Punto de entrada de la aplicación
    ├── config/
    │   └── db.js            # Conexión a MongoDB
    ├── models/              # Modelos y esquemas de Mongoose
    ├── controllers/         # Lógica de los controladores CRUD
    └── routes/              # Definición de rutas HTTP
```

## Instalación y Configuración del Equipo

Cada integrante del equipo debe seguir estos pasos en su computadora local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com
   cd comerciotech-backend-crud
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   * Duplica el archivo `.env.example` y renómbralo a `.env`.
   * Coloca tu cadena de conexión de MongoDB en la variable `MONGO_URI`.

4. **Correr el servidor en desarrollo:**
   ```bash
   npm run dev
   ```
