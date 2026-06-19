# ComercioTech - Backend CRUD

Este proyecto consiste en una API robusta, segura y escalable para gestionar los datos de clientes, productos y pedidos de la empresa *ComercioTech*.

## Tecnologías Utilizadas
* **Node.js** (Entorno de ejecución)
* **Express** (Framework de servidor)
* **MongoDB** (Base de datos NoSQL)
* **Mongoose** (Modelado de datos)

## Estructura del Proyecto
```├── .env.example             # Plantilla de variables de entorno para el equipo
├── .gitignore               # Archivos excluidos del repositorio global
├── README.md                # Portada con instrucciones de clonación y arranque
├── frontend/                # Aplicación de interfaz visual (React + Vite + Axios)
└── backend/                 # API REST del Servidor (Node.js + Express + Mongoose)
    ├── package.json         # Dependencias y scripts de arranque del servidor
    └── src/
        ├── server.js        # Punto de entrada de la aplicación y puerto 5001
        ├── config/
        │   └── db.js        # Lógica de conexión a la nube de MongoDB Atlas
        ├── models/          # Modelos NoSQL (Client.js, Product.js, Order.js)
        ├── controllers/     # Lógica CRUD (clientController.js, etc.)
        └── routes/          # Endpoints HTTP (clientRoutes.js, etc.)


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
