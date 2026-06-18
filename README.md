# comerciotech-backend-crud
Proyecto ComercioTech para manejar de manera masiva cantidades de clientes y transacciones.

# Estructura central


├── .env                     # Variables de entorno secretas (MONGO_URI)
├── .gitignore               # Configurado para ignorar node_modules y .env
├── README.md                # Instrucciones del proyecto para el equipo
├── package.json             # Inicializado con: npm init -y
└── src/
    ├── server.js            # Inicialización de Express y puerto de escucha
    ├── config/
    │   └── db.js            # Lógica de conexión a MongoDB Atlas / Local
    ├── models/
    │   ├── Client.js        # Esquema de Clientes (NoSQL)
    │   ├── Product.js       # Esquema de Productos (NoSQL)
    │   └── Order.js         # Esquema de Pedidos (Relaciones)
    ├── controllers/
    │   ├── clientController.js
    │   ├── productController.js
    │   └── orderController.js
    └── routes/
        ├── clientRoutes.js
        ├── productRoutes.js
        └── orderRoutes.js
