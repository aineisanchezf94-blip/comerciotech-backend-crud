# Código de Conexión y Operaciones CRUD (extracto)

## Conexión (archivo actual)
Se usa Mongoose en `backend/src/config/db.js`:

```js
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/comerciotech';
await mongoose.connect(uri);
```

## Ejemplo CRUD — cliente (controlador)
Crear cliente (ya implementado en `backend/src/controllers/clientController.js`):

```js
exports.createClient = async (req, res) => {
  const newClient = new Client(req.body);
  const savedClient = await newClient.save();
  res.status(201).json(savedClient);
};
```

## Ejecución local y seed
1. Desde la raíz del repo, levantar servicios con Docker (requiere Docker instalado):

```bash
docker-compose up --build -d
```

2. Ejecutar seed para poblar datos de ejemplo (desde `backend`):

```bash
cd backend
npm install
npm run seed
```
