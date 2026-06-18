const express = require('express');
const dotenv = require('dotenv');

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Ruta de prueba inicial
app.use('/api', (req, res) => {
  res.json({ message: "Bienvenido a la API de ComercioTech" });
});

// Inicializar Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
