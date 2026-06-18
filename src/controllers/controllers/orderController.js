const Order = require('../models/Order');

// CREAR PEDIDO
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// LEER TODOS LOS PEDIDOS
exports.getOrders = async (req, res) => {
  try {
    // El .populate trae automáticamente la información del Cliente y del Producto en lugar de solo ver el ID
    const orders = await Order.find()
      .populate('client')
      .populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LEER UN PEDIDO POR ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client')
      .populate('products.product');
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR ESTADO DEL PEDIDO (ej. cambiar de Pendiente a Enviado)
exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ELIMINAR PEDIDO
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.status(200).json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
