const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

dotenv.config();

const dump = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({});
    fs.writeFileSync(path.join(__dirname, 'all_products.json'), JSON.stringify(products, null, 2));
    console.log(`DUMP COMPLETADO: ${products.length} productos guardados.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

dump();
