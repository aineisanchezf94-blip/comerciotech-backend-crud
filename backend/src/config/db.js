const mongoose = require('mongoose');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/comerciotech';
  if (!process.env.MONGO_URI) console.warn('Warning: MONGO_URI no definido, usando URI por defecto para desarrollo. No use esto en producción.');

  // Habilitar debug de Mongoose en entornos no productivos para ver queries
  mongoose.set('debug', process.env.NODE_ENV !== 'production');

  const maxRetries = 10;
  let attempt = 0;

  while (true) {
    try {
      attempt++;
      const conn = await mongoose.connect(uri, { autoIndex: true });
      console.log(`MongoDB Conectado: ${conn.connection.host}`);

      // Listeners adicionales para diagnosticar problemas de conexión
      mongoose.connection.on('connected', () => console.log('Mongoose: conexión abierta'));
      mongoose.connection.on('error', (err) => console.error('Mongoose: error de conexión', err));
      mongoose.connection.on('disconnected', () => console.warn('Mongoose: desconectado'));

      break; // conectado correctamente
    } catch (error) {
      console.error(`Error de conexión (intento ${attempt}): ${error.message}`);
      if (attempt >= maxRetries) {
        console.error('Número máximo de reintentos alcanzado. Abortando.');
        process.exit(1);
      }
      const delay = Math.min(30000, 2000 * attempt);
      console.log(`Reintentando conexión en ${delay / 1000}s...`);
      await sleep(delay);
    }
  }
};

module.exports = connectDB;

