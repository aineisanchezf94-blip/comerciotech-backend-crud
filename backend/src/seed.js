const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const Client = require('./models/Client');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function seed() {
  try {
    // Usar connectDB con reintentos para asegurar que MongoDB esté disponible
    await connectDB();
    console.log('Conectado para seed (usando connectDB)');

    // Limpiar colecciones (solo en entorno de desarrollo)
    await Promise.all([
      Client.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    const clients = await Client.insertMany([
      { name: 'María Pérez', email: 'maria@example.com', phone: '555-0001', address: 'Calle Uno 123' },
      { name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '555-0002', address: 'Av. Secundaria 45' }
    ]);

    const products = await Product.insertMany([
      { name: 'Auriculares Bluetooth', description: 'Negro con cancelación', price: 79.9, stock: 50 },
      { name: 'Cargador USB-C', description: 'Rápido 30W', price: 19.5, stock: 200 }
    ]);

    const order = await Order.create({
      client: clients[0]._id,
      products: [ { product: products[0]._id, quantity: 2 }, { product: products[1]._id, quantity: 1 } ],
      totalAmount: products[0].price * 2 + products[1].price * 1,
      status: 'Pendiente'
    });

    console.log('Seed completado. Clientes:', clients.length, 'Productos:', products.length, 'Pedido creado:', order._id);
    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err);
    process.exit(1);
  }
}

seed();
