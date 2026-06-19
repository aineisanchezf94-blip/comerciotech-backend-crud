const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Configuración de entorno
dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Vinculación de Rutas Modulares Oficiales
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Ruta de diagnóstico inicial
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "API de ComercioTech funcionando correctamente" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor de ComercioTech activo en puerto ${PORT}`));
