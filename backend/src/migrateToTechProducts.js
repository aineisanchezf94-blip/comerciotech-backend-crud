const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Order = require('./models/Order');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Mapeo detallado de ID numérico a nuevos atributos de producto tecnológico
const techMapping = {
  1: {
    name: "Mouse Gamer Inalámbrico RGB",
    description: "Mouse ergonómico de alta precisión con sensor de 16000 DPI y luces RGB.",
    price: 29000
  },
  2: {
    name: "Teclado Mecánico Hot-swappable",
    description: "Teclado mecánico compacto con switches mecánicos táctiles y retroiluminación.",
    price: 59000
  },
  3: {
    name: "Hub USB-C 8 en 1",
    description: "Adaptador multipuerto con HDMI 4K, lector de tarjetas SD y puertos USB 3.0.",
    price: 24000
  },
  4: {
    name: "Base de Carga Inalámbrica 3 en 1",
    description: "Estación de carga inalámbrica rápida para celular, smartwatch y audífonos.",
    price: 35000
  },
  5: {
    name: "Smartwatch Deportivo Pro",
    description: "Reloj inteligente con GPS, sensor de ritmo cardíaco y resistencia al agua IP68.",
    price: 89000
  },
  6: {
    name: "Memoria RAM DDR4 16GB 3200MHz",
    description: "Módulo de memoria RAM de alto rendimiento con disipador térmico.",
    price: 42000
  },
  7: {
    name: "Disco Duro Externo 2TB",
    description: "Unidad de almacenamiento externo portátil con conexión USB 3.0 de alta velocidad.",
    price: 69000
  },
  8: {
    name: "Tarjeta MicroSD XC 256GB",
    description: "Memoria de alta velocidad ideal para consolas portátiles y grabación de video 4K.",
    price: 28000
  },
  9: {
    name: "Trackpad inalámbrico para Laptop",
    description: "Trackpad inalámbrico para una mejor navegación en laptop.",
    price: 45000
  },
  10: {
    name: "Soporte de Notebook Ajustable",
    description: "Soporte ergonómico de aluminio para laptop con altura regulable.",
    price: 18000
  },
  11: {
    name: "Cámara de Seguridad Digital Inalámbrica",
    description: "Sistema de cámara de seguridad inalámbrica digital segura.",
    price: 180000
  },
  12: {
    name: "Cargador de Pared GaN 65W",
    description: "Cargador ultra compacto con doble puerto USB-C y USB-A de carga rápida.",
    price: 29000
  },
  13: {
    name: "Powerbank 20000mAh con QC 3.0",
    description: "Batería externa portátil de alta capacidad con carga rápida USB-C.",
    price: 32000
  },
  14: {
    name: "Cable Thunderbolt 4 USB-C",
    description: "Cable de alta velocidad con soporte para transferencia de 40Gbps y video 8K.",
    price: 19000
  },
  15: {
    name: "Aro de Luz LED 10 pulgadas",
    description: "Aro de luz regulable con trípode y soporte para celular, ideal para streaming.",
    price: 15000
  },
  16: {
    name: "Micrófono de Condensador USB",
    description: "Micrófono con patrón cardioide para podcast, streaming y grabación de voz.",
    price: 39000
  },
  17: {
    name: "Organizador de Cables Magnético",
    description: "Base de silicona con clips magnéticos para organizar cables en el escritorio.",
    price: 8000
  },
  18: {
    name: "Disipador de CPU por Aire RGB",
    description: "Cooler de CPU con ventilador de 120mm RGB y base de cobre de disipación.",
    price: 22000
  },
  19: {
    name: "Kit de Raspberry Pi 4 Model B",
    description: "Placa de desarrollo con 4GB RAM, carcasa protectora, ventilador y disipadores.",
    price: 79000
  },
  20: {
    name: "Tableta Digitalizadora de Dibujo",
    description: "Tableta para diseño gráfico con lápiz óptico sin batería de 8192 niveles.",
    price: 49000
  },
  21: {
    name: "Bicicleta Eléctrica",
    description: "Bicicleta eléctrica ecológica con una autonomía de 48 kilómetros.",
    price: 810000
  },
  22: {
    name: "Bolso Organizador de Tech y Cables",
    description: "Estuche impermeable con múltiples compartimentos acolchados para accesorios tech.",
    price: 16000
  },
  23: {
    name: "Audífonos In-Ear True Wireless",
    description: "Audífonos inalámbricos estéreo con control táctil y estuche de carga USB-C.",
    price: 25000
  },
  24: {
    name: "Lámpara de Escritorio Inteligente Wi-Fi",
    description: "Lámpara LED con control de tono y brillo desde app móvil o asistentes de voz.",
    price: 28000
  },
  25: {
    name: "Tira de Luces LED Inteligentes RGBIC",
    description: "Luces LED direccionables de 5 metros controlables por Wi-Fi y app móvil.",
    price: 19000
  },
  26: {
    name: "Almohadilla de Escritorio XXL Antideslizante",
    description: "Mousepad extra grande de 90x40cm con superficie de microfibra y base de goma.",
    price: 14000
  },
  27: {
    name: "Pasta Térmica de Alto Rendimiento",
    description: "Compuesto térmico premium para procesadores de CPU y GPU con alta conductividad.",
    price: 6000
  },
  28: {
    name: "Soporte de Audífonos RGB con USB",
    description: "Soporte vertical para audífonos diadema con iluminación RGB y 2 puertos USB.",
    price: 18000
  },
  29: {
    name: "Ventilador de Gabinete PC 120mm RGB",
    description: "Fan silencioso con rodamientos hidráulicos y sincronización de colores RGB.",
    price: 12000
  },
  30: {
    name: "Mini Proyector Portátil HD",
    description: "Proyector LED compacto con batería integrada, HDMI y reproducción multimedia.",
    price: 89000
  },
  31: {
    name: "Adaptador Bluetooth 5.0 USB",
    description: "Nano dongle USB para conectar dispositivos de audio y mandos de forma inalámbrica.",
    price: 7000
  },
  32: {
    name: "Limpiador de Teclado de Gel de Silicona",
    description: "Gel limpiador moldeable para remover suciedad de rincones difíciles y teclados.",
    price: 4000
  },
  33: {
    name: "Escáner de Diagnóstico Automotriz",
    description: "Herramienta para verificar códigos de motor de autos y problemas de rendimiento.",
    price: 45000
  },
  34: {
    name: "Adaptador HDMI a VGA con Audio",
    description: "Adaptador para conectar dispositivos HDMI a pantallas o proyectores VGA clásicos.",
    price: 6000
  },
  35: {
    name: "Aspiradora Robot Inteligente",
    description: "Aspiradora robot inteligente para limpieza automática.",
    price: 270000
  },
  36: {
    name: "Termómetro Higrómetro Digital Inteligente",
    description: "Sensor digital de temperatura y humedad ambiental con conexión inalámbrica.",
    price: 12000
  },
  37: {
    name: "Kit de Limpieza de Pantallas 3 en 1",
    description: "Solución limpiadora antiestática para pantallas con paño de microfibra.",
    price: 5000
  },
  38: {
    name: "Soporte de Celular para Rejilla Auto",
    description: "Soporte magnético universal para rejilla de ventilación del vehículo.",
    price: 7000
  },
  39: {
    name: "Lector de Tarjetas SD/MicroSD USB 3.0",
    description: "Adaptador para lectura rápida de tarjetas SD y MicroSD directo a puerto USB.",
    price: 9000
  },
  40: {
    name: "Interruptor Inteligente Wi-Fi",
    description: "Módulo inteligente para domotizar luces o enchufes directo en la pared.",
    price: 11000
  },
  41: {
    name: "Luz LED de Clip para E-Reader/Libros",
    description: "Linterna de lectura portátil recargable con pinza para libros y pantallas.",
    price: 8000
  },
  42: {
    name: "Pilas Recargables AA NiMH Pack 4x",
    description: "Baterías precargadas recargables de larga duración para controles y juguetes.",
    price: 12000
  },
  43: {
    name: "Cargador para Auto USB Carga Rápida",
    description: "Adaptador de mechero de auto con carga rápida QuickCharge 3.0.",
    price: 9000
  },
  44: {
    name: "Organizador de Cables Velcro (3 metros)",
    description: "Cinta de velcro ajustable y recortable para el orden de tendido eléctrico.",
    price: 4000
  },
  45: {
    name: "Gabinete Externo SSD M.2 NVMe USB-C",
    description: "Carcasa de aluminio para transformar SSD M.2 internos en discos rápidos USB.",
    price: 22000
  },
  46: {
    name: "Soporte de Webcam para Monitor",
    description: "Soporte de webcam articulado para colocar encima de monitores o repisas.",
    price: 7000
  },
  47: {
    name: "Cuaderno Digital Inteligente Reutilizable",
    description: "Libreta reutilizable con hojas que se digitalizan a la nube mediante app móvil.",
    price: 28000
  },
  48: {
    name: "Transmisor HDMI Inalámbrico",
    description: "Transmite video HD de forma inalámbrica a tu televisor.",
    price: 72000
  },
  49: {
    name: "Extractor de Switches y Teclas 2 en 1",
    description: "Herramienta metálica para remoción segura de teclas en teclados mecánicos.",
    price: 5000
  },
  50: {
    name: "Luz LED de Emergencia Recargable USB",
    description: "Foco de luz de emergencia LED con batería recargable de alta duración.",
    price: 12000
  },
  51: {
    name: "Adaptador USB 3.0 a Gigabit Ethernet",
    description: "Adaptador para conectar cables de red RJ45 a laptops sin puerto Ethernet.",
    price: 14000
  },
  52: {
    name: "Botella de Agua Autolimpiable con UV-C",
    description: "Botella de agua con luz UV-C integrada para autolimpieza.",
    price: 45000
  },
  53: {
    name: "Mouse Gamer Óptico Alámbrico",
    description: "Mouse ergonómico de 6 botones personalizables y sensor óptico de 7200 DPI.",
    price: 12000
  },
  54: {
    name: "Kit de Herramientas de Precisión 120 en 1",
    description: "Set completo de destornilladores y pinzas para desarme de celulares y consolas.",
    price: 24000
  },
  55: {
    name: "Enfriador de Laptop con 5 Ventiladores",
    description: "Base de refrigeración con altura regulable y luces LED para laptops gamer.",
    price: 19000
  },
  56: {
    name: "Cinta Adhesiva Térmica de Doble Cara",
    description: "Cinta térmica de alta resistencia para fijar disipadores en componentes de PC.",
    price: 5000
  },
  57: {
    name: "Soporte de Brazo para Micrófono",
    description: "Brazo articulado metálico con abrazadera para escritorio para streaming.",
    price: 16000
  },
  58: {
    name: "Licuadora Inteligente Portátil USB-C",
    description: "Licuadora portátil con batería recargable y motor potente para viajes.",
    price: 29000
  },
  59: {
    name: "Disco SSD Interno 500GB SATA 3",
    description: "Unidad de estado sólido para mejorar el rendimiento de almacenamiento de PC.",
    price: 35000
  },
  60: {
    name: "Control Remoto Presentador Inalámbrico",
    description: "Puntero láser rojo para diapositivas con receptor inalámbrico USB.",
    price: 12000
  },
  61: {
    name: "Sensor de Humedad de Suelo Inteligente",
    description: "Sensor inteligente con alerta en la app móvil sobre niveles de sequedad.",
    price: 14000
  },
  62: {
    name: "Cargador USB-C de Repuesto para Laptop 65W",
    description: "Cargador universal USB-C Power Delivery para laptops modernas y MacBooks.",
    price: 24000
  },
  63: {
    name: "Silla Gamer Ergonómica Pro",
    description: "Silla gamer reclinable con reposapiés, almohadones lumbar y cervical.",
    price: 149000
  },
  64: {
    name: "Base Enfriadora de Consola PS5/Xbox",
    description: "Estación de enfriamiento vertical con ventilador y docks de carga de mandos.",
    price: 28000
  },
  65: {
    name: "Enchufe Inteligente Smart Plug Wi-Fi",
    description: "Adaptador de enchufe programable compatible con Google Home y Alexa.",
    price: 9000
  },
  66: {
    name: "Organizador de Cables bajo Escritorio",
    description: "Bandeja metálica de rejilla pasacables para montar bajo el escritorio.",
    price: 12000
  },
  67: {
    name: "Tarjeta Capturadora de Video HDMI a USB",
    description: "Capturadora compacta para grabación y streaming de consolas de juegos.",
    price: 18000
  },
  68: {
    name: "Taza Térmica Inteligente con Control de Temp",
    description: "Taza inteligente con pantalla táctil e indicador de temperatura exacta.",
    price: 39000
  },
  69: {
    name: "Collar de Perro con Localizador GPS Inteligente",
    description: "Collar para mascotas con ranura SIM para geolocalización en tiempo real.",
    price: 32000
  },
  70: {
    name: "Mouse Pad Ergonómico con Soporte para Muñeca",
    description: "Mouse pad ergonómico con soporte para muñeca.",
    price: 13000
  },
  71: {
    name: "Mini Refrigerador USB para Bebidas de Escritorio",
    description: "Minibar de escritorio con alimentación USB con espacio para dos latas.",
    price: 28000
  },
  72: {
    name: "Limpiador de Aire Comprimido Soplador",
    description: "Soplador eléctrico recargable de alta velocidad para limpieza de PC.",
    price: 24000
  },
  73: {
    name: "Lámpara LED Barra de Pantalla Monitor",
    description: "Barra de luz asimétrica para monitor con conexión USB para iluminar teclado.",
    price: 32000
  },
  74: {
    name: "Lápiz 3D de Impresión con Filamento",
    description: "Lápiz para dibujar estructuras tridimensionales con filamentos PLA.",
    price: 29000
  },
  75: {
    name: "Repetidor Wi-Fi Dual Band 1200Mbps",
    description: "Extensor de rango Wi-Fi inalámbrico con antenas externas y puerto LAN.",
    price: 16000
  },
  76: {
    name: "Hervidor Eléctrico Compacto",
    description: "Hervidor eléctrico de ebullición rápida para cocinas pequeñas y dormitorios.",
    price: 27000
  },
  77: {
    name: "Mochila Mochilero Tech Impermeable",
    description: "Mochila ergonómica impermeable con compartimentos acolchados y puerto USB.",
    price: 42000
  },
  78: {
    name: "Gafas de Realidad Virtual para Smartphone",
    description: "Lentes de realidad virtual ajustables compatibles con celulares de 5\" a 6.5\".",
    price: 19000
  },
  79: {
    name: "Estuche Antiestático Organizador de Tarjetas",
    description: "Estuche sellado para guardar de forma segura tarjetas SD, MicroSD y nanoSIM.",
    price: 8000
  },
  80: {
    name: "Soporte Multifuncional para Celular",
    description: "Soporte multifuncional para celular.",
    price: 12000
  },
  81: {
    name: "Cable de Red RJ45 Cat 6 (10 metros)",
    description: "Cable Ethernet categoría 6 de alta velocidad y baja interferencia.",
    price: 9000
  },
  82: {
    name: "Adaptador USB 3.0 Hub de 4 Puertos",
    description: "Concentrador USB portátil de alta velocidad con 4 puertos para periféricos.",
    price: 7000
  },
  83: {
    name: "Collar de Entrenamiento Recargable para Perros",
    description: "Collar de adiestramiento recargable para un entrenamiento eficaz.",
    price: 36000
  },
  84: {
    name: "Mouse Pad Ergonómico con Soporte para Muñeca",
    description: "Mouse pad ergonómico con soporte para muñeca.",
    price: 13000
  },
  85: {
    name: "Adaptador Divisor Jack 3.5mm Mic y Aud",
    description: "Cable divisor Y para conectar audífonos antiguos con dos conectores.",
    price: 3000
  },
  86: {
    name: "Parlante Bluetooth Portátil",
    description: "Parlante Bluetooth portátil con sonido nítido.",
    price: 45000
  },
  87: {
    name: "Cámara Digital Compacta 20MP",
    description: "Cámara digital compacta de 20MP de resolución.",
    price: 270000
  },
  88: {
    name: "Cargador Inalámbrico Magnético MagSafe",
    description: "Cargador inalámbrico Qi compatible con carga rápida magnética de iPhone.",
    price: 19000
  },
  89: {
    name: "Correas de Reloj Intercambiables",
    description: "Juego de elegantes correas de reloj para personalizar tu estilo.",
    price: 22000
  },
  90: {
    name: "Kit Educativo Arduino Uno R3",
    description: "Placa de desarrollo con múltiples sensores y leds para aprendizaje de electrónica.",
    price: 29000
  },
  91: {
    name: "Termómetro Infrarrojo Sin Contacto",
    description: "Termómetro sin contacto para comprobar temperaturas al instante.",
    price: 36000
  },
  92: {
    name: "Kit Limpiador de Audífonos AirPods",
    description: "Lápiz limpiador con punta metálica y cepillo para rejillas de audífonos.",
    price: 6000
  },
  93: {
    name: "Base Cargadora de Controles Nintendo Switch",
    description: "Soporte de carga rápida para hasta 4 Joy-Con de manera simultánea.",
    price: 12000
  },
  94: {
    name: "Organizador de Cables Espiral (2 metros)",
    description: "Manga organizadora flexible para agrupar múltiples cables de TV o PC.",
    price: 5000
  },
  95: {
    name: "Smartwatch Multideporte GPS Adventure",
    description: "Reloj de alta resistencia militar con GPS, mapas sin conexión y brújula.",
    price: 119000
  },
  96: {
    name: "Correas de Reloj Intercambiables",
    description: "Juego de elegantes correas de reloj para personalizar tu estilo.",
    price: 22000
  },
  97: {
    name: "Soporte Ajustable para Tablet y Celular",
    description: "Soporte ajustable para tablet y celular.",
    price: 18000
  },
  98: {
    name: "Lente Macro y Gran Angular para Celular",
    description: "Lentes intercambiables clip-on para mejorar la cámara fotográfica de celular.",
    price: 8000
  },
  99: {
    name: "Cepillo de Dientes Eléctrico Sónico",
    description: "Cepillo dental recargable por USB de alta frecuencia y 5 modos de uso.",
    price: 24000
  },
  100: {
    name: "Mouse Pad Gamer RGB Extendido",
    description: "Alfombrilla gigante con base antideslizante y bordes iluminados con luz de color.",
    price: 15000
  }
};

const extraMapping = {
  "Auriculares Bluetooth": {
    name: "Auriculares Bluetooth Pro",
    description: "Auriculares inalámbricos con cancelación de ruido activa y estuche recargable.",
    price: 79000
  },
  "Auriculares Bluetooth Pro": {
    name: "Auriculares Bluetooth Pro",
    description: "Auriculares inalámbricos con cancelación de ruido activa y estuche recargable.",
    price: 79000
  },
  "Cargador USB-C": {
    name: "Cargador USB-C Rápido",
    description: "Cargador de pared de carga rápida 30W USB-C PD.",
    price: 19000
  },
  "Cargador USB-C Rápido": {
    name: "Cargador USB-C Rápido",
    description: "Cargador de pared de carga rápida 30W USB-C PD.",
    price: 19000
  }
};

const runMigration = async () => {
  try {
    console.log('Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('¡Conectado exitosamente a MongoDB!');

    // Usar la colección nativa para evitar virtuals de Mongoose
    const products = await Product.collection.find({}).toArray();
    console.log(`Se encontraron ${products.length} productos en la base de datos.`);

    let updatedCount = 0;

    for (let product of products) {
      let updateData = null;
      const numericId = product.id; // En el driver nativo esto es el número (1-100) o undefined

      if (numericId && techMapping[numericId]) {
        updateData = techMapping[numericId];
      } else if (extraMapping[product.name]) {
        updateData = extraMapping[product.name];
      }

      if (updateData) {
        const oldName = product.name;
        
        await Product.collection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              name: updateData.name, 
              description: updateData.description, 
              price: Math.round(updateData.price) 
            } 
          }
        );
        
        updatedCount++;
        console.log(`Actualizado [ID numérico: ${numericId || 'N/A'}]: "${oldName}" -> "${updateData.name}" ($${updateData.price} CLP)`);
      } else {
        console.log(`Sin cambios requeridos o sin mapeo para [ID numérico: ${numericId || 'N/A'}]: "${product.name}"`);
      }
    }

    console.log(`\nMigración finalizada. Se actualizaron ${updatedCount} productos.`);
    
    // Generar el archivo all_products.json sincronizado
    const updatedProducts = await Product.find({});
    const jsonPath = path.join(__dirname, 'all_products.json');
    fs.writeFileSync(jsonPath, JSON.stringify(updatedProducts, null, 2));
    console.log(`Archivo all_products.json actualizado en ${jsonPath} con ${updatedProducts.length} productos.`);

    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

runMigration();
