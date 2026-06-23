const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const Product = require('./models/Product');

dotenv.config();

const recalculate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB para recalcular órdenes.');

    const orders = await Order.find({}).populate('products.product');
    console.log(`Se encontraron ${orders.length} órdenes para procesar.`);

    let countUpdated = 0;

    for (let order of orders) {
      let recalculatedTotal = 0;
      let hasValidProducts = true;

      for (let item of order.products) {
        if (item.product) {
          recalculatedTotal += item.product.price * (item.quantity || 0);
        } else {
          hasValidProducts = false;
        }
      }

      // Si todos los productos de la orden son válidos y el total actual difiere del recalculado
      if (hasValidProducts && order.products.length > 0) {
        // Redondear totalAmount a miles también para consistencia
        const closedTotal = Math.round(recalculatedTotal / 1000) * 1000;
        
        if (order.totalAmount !== closedTotal) {
          const oldTotal = order.totalAmount;
          order.totalAmount = closedTotal;
          await order.save();
          countUpdated++;
          console.log(`Orden ${order._id} actualizada: $${oldTotal} -> $${order.totalAmount} CLP`);
        }
      }
    }

    console.log(`\nPROCESAMIENTO DE ÓRDENES COMPLETADO:`);
    console.log(`- Órdenes recalculadas y actualizadas a CLP cerrado: ${countUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error('Error durante el recálculo de órdenes:', error);
    process.exit(1);
  }
};

recalculate();
