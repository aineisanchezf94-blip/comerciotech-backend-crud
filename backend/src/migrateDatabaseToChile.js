const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Client = require('./models/Client');

dotenv.config();

// Listas de datos para chilenizar a los clientes
const nombresChilenos = [
  "Sofía", "Valentina", "Isabella", "Emilia", "Florencia", "Agustina", "Josefa", "Amanda", "Antonella", "Camila",
  "Francisca", "Fernanda", "Catalina", "Javiera", "Constanza", "Ignacia", "Benjamín", "Vicente", "Martín", "Matías",
  "Joaquín", "Agustín", "Cristóbal", "Sebastián", "Tomás", "Diego", "Nicolás", "Felipe", "Andrés", "Alejandro",
  "Pedro", "Manuel", "José", "Rodrigo", "Cristián", "Mauricio"
];

const apellidosChilenos = [
  "González", "Muñoz", "Rojas", "Díaz", "Pérez", "Soto", "Contreras", "Silva", "Martínez", "Sepúlveda",
  "Morales", "Rodríguez", "López", "Fuentes", "Valenzuela", "Araya", "Carrasco", "Gómez", "Herrera", "Cáceres",
  "Jara", "Castro", "Vargas", "Flores", "Guzmán", "Henríquez", "Saavedra", "Maldonado", "Bustos", "Ortega",
  "Venegas", "Pinto", "Godoy", "Salinas", "Tapia"
];

const callesChilenas = [
  "Av. Providencia", "Alameda Bernardo O'Higgins", "Av. Apoquindo", "Av. Las Condes", "Av. Vitacura",
  "Av. Irarrázaval", "Calle Prat", "Av. Pedro de Valdivia", "Av. Vicuña Mackenna", "Av. Recoleta",
  "Calle Valparaíso", "Av. Américo Vespucio", "Calle Huérfanos", "Calle Agustinas", "Av. Bilbao", "Av. Pajaritos"
];

const comunasChilenas = [
  "Santiago Centro", "Providencia", "Las Condes", "Vitacura", "Ñuñoa", "Maipú", "La Florida", "Puente Alto",
  "San Miguel", "Viña del Mar", "Valparaíso", "Concepción", "Temuco", "La Serena", "Antofagasta", "Rancagua"
];

const emailsDomains = ["gmail.com", "outlook.cl", "yahoo.cl", "vtr.net", "mi-empresa.cl"];

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB.');

    // 1. ACTUALIZACIÓN DE PRODUCTOS (PRECIOS CERRADOS A MILES)
    console.log('\n--- PROCESANDO PRODUCTOS ---');
    const products = await Product.find({});
    let countProductsUpdated = 0;
    
    for (let product of products) {
      const oldPrice = product.price;
      
      // Cerrar el precio a la milésima (ej: 44991 -> 45000)
      const closedPrice = Math.round(product.price / 1000) * 1000;
      
      // Si el precio de entrada no era múltiplo de 1000, o contenía decimales/centenas, se actualiza
      if (product.price !== closedPrice) {
        product.price = closedPrice;
        await product.save();
        countProductsUpdated++;
        console.log(`Producto "${product.name}": $${oldPrice} -> $${product.price} CLP`);
      }
    }
    console.log(`Total de productos actualizados con precio cerrado: ${countProductsUpdated}`);

    // 2. ACTUALIZACIÓN DE CLIENTES (CHILENIZACIÓN)
    console.log('\n--- PROCESANDO CLIENTES ---');
    const clients = await Client.find({});
    let countClientsUpdated = 0;

    for (let i = 0; i < clients.length; i++) {
      let client = clients[i];
      let needsSave = false;

      // Determinamos si el cliente tiene un nombre de EE.UU. o requiere chilenización.
      // Si el nombre tiene correos de dominios estadounidenses/extranjeros o teléfonos de 10 dígitos con guiones:
      const nameIsEnglish = !nombresChilenos.some(n => client.name.includes(n));
      const hasUSPhone = client.phone && client.phone.includes('-');
      
      if (nameIsEnglish || hasUSPhone) {
        // Generar un nombre y apellido de forma estable usando el índice
        const indexNombre = i % nombresChilenos.length;
        const indexApellido = (i * 3) % apellidosChilenos.length;
        const indexApellido2 = (i * 7) % apellidosChilenos.length;
        const nombreCompleto = `${nombresChilenos[indexNombre]} ${apellidosChilenos[indexApellido]} ${apellidosChilenos[indexApellido2]}`;
        
        // Correo electrónico
        const sanitizedNombre = nombresChilenos[indexNombre].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const sanitizedApellido = apellidosChilenos[indexApellido].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const domain = emailsDomains[i % emailsDomains.length];
        const emailChileno = `${sanitizedNombre}.${sanitizedApellido}@${domain}`;

        // Teléfono (+56 9 XXXX XXXX)
        // Usar dígitos basados en el índice para que sea semi-aleatorio pero reproducible
        const digitPart1 = String((1234 + i * 45) % 10000).padStart(4, '0');
        const digitPart2 = String((5678 + i * 67) % 10000).padStart(4, '0');
        const telefonoChileno = `+56 9 ${digitPart1} ${digitPart2}`;

        // Dirección Chilena
        const calle = callesChilenas[i % callesChilenas.length];
        const numero = (100 + i * 23) % 9999;
        const comuna = comunasChilenas[(i * 2) % comunasChilenas.length];
        const direccionChilena = `${calle} ${numero}, ${comuna}`;

        console.log(`Chilenizando cliente "${client.name}":`);
        console.log(`  - Nombre: ${client.name} -> ${nombreCompleto}`);
        console.log(`  - Email: ${client.email} -> ${emailChileno}`);
        console.log(`  - Teléfono: ${client.phone} -> ${telefonoChileno}`);
        console.log(`  - Dirección: ${client.address} -> ${direccionChilena}`);

        client.name = nombreCompleto;
        client.email = emailChileno;
        client.phone = telefonoChileno;
        client.address = direccionChilena;
        
        await client.save();
        countClientsUpdated++;
      }
    }
    console.log(`Total de clientes chilenizados: ${countClientsUpdated}`);

    console.log('\nMIGRACIÓN Y CONVERSIÓN A CHILE COMPLETADA CON ÉXITO.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

migrate();
