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

// Ruta de diagnóstico inicial
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "API de ComercioTech funcionando" });
});

// Vinculación de Rutas Modulares (El equipo agregará las suyas aquí)
// app.use('/api/products', require('./routes/productRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
