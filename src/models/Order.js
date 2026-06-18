const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  products: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pendiente', 'Enviado', 'Entregado'], 
    default: 'Pendiente' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
