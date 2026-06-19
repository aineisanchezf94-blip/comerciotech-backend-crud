const Client = require('../models/Client');

// CREAR
exports.createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// LEER TODOS
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LEER UNO
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ELIMINAR
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
