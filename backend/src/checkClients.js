const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('./models/Client');

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const clients = await Client.find({}).limit(15);
    console.log('CLIENTES (Primeros 15):', JSON.stringify(clients, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

check();
