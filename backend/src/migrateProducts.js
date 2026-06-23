const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Diccionario de traducción estática para nombres y descripciones de productos
const translationDict = {
  // Nombres
  names: {
    "Chocolate Fudge Brownie Mix": "Mezcla para Brownie de Chocolate",
    "Thai Coconut Curry Sauce": "Salsa de Curry de Coco Tailandés",
    "Sliced Olives": "Aceitunas en Rodajas",
    "Coconut Milk Ice Cream": "Helado de Leche de Coco",
    "Green Smoothie Mix": "Mezcla para Batido Verde",
    "Organic Black Bean Burger": "Hamburguesa Orgánica de Frijol Negro",
    "Chicken Sausage": "Salchicha de Pollo",
    "Frozen Hash Browns": "Papas Hash Brown Congeladas",
    "Trackpad for Laptop": "Trackpad inalámbrico para Laptop",
    "Whole Grain Hamburger Buns": "Panes de Hamburguesa de Trigo Entero",
    "Digital Wireless Camera": "Cámara de Seguridad Digital Inalámbrica",
    "Peach & Mango Salsa": "Salsa de Durazno y Mango",
    "Caribbean Jerk Marinade": "Marinado Jerk Caribeño",
    "Greek Feta Cheese": "Queso Feta Griego",
    "Set of Gardening Gloves with Claws": "Guantes de Jardinería con Garras",
    "Suction Cup Hooks": "Ganchos con Ventosa",
    "Honey Sesame Cashews": "Castañas de Cajú con Miel y Sésamo",
    "Children's Gardening Set": "Juego de Jardinería para Niños",
    "Kids' Art Easel": "Caballete de Arte para Niños",
    "Electric Bike": "Bicicleta Eléctrica",
    "Travel Organizer": "Organizador de Viajes",
    "Basil Pesto Pasta": "Pasta al Pesto de Albahaca",
    "Inspirational Wall Art": "Arte de Pared Inspiracional",
    "Berries Medley": "Mezcla de Bayas Frescas",
    "Weighted Blanket": "Manta de Peso Terapéutica",
    "Chickpea Flour": "Harina de Garbanzos",
    "Bamboo Cutting Board": "Tabla de Cortar de Bambú",
    "Basmati Rice": "Arroz Basmati",
    "Tailgating Set": "Juego de Parrilla y Picnic",
    "Stainless Steel Straws": "Bombillas de Acero Inoxidable",
    "Warm Knit Beanie": "Gorro de Lana Abrigado",
    "Car Diagnostic Scanner": "Escáner de Diagnóstico Automotriz",
    "Sliced Avocado": "Palta Laminada",
    "Robot Vacuum Cleaner": "Aspiradora Robot Inteligente",
    "Strawberry Banana Smoothie Pack": "Pack de Batido de Frutilla y Plátano",
    "Kid's Fruit Snacks": "Gomitas de Fruta para Niños",
    "Savory Oats": "Avena Salada",
    "Curried Lentil Salad": "Ensalada de Lentejas al Curry",
    "Balsamic Glaze": "Glaseado Balsámico",
    "Coloring Books for Adults": "Libros de Colorear para Adultos",
    "Energy Protein Bars": "Barras de Proteína Energéticas",
    "Honey": "Miel de Abeja Pura",
    "Safety Pin Dispenser": "Dispensador de Alfileres de Gancho",
    "Stuffed Peppers with Quinoa": "Pimientos Rellenos con Quínoa",
    "Cacao Nibs": "Nibs de Cacao Orgánicos",
    "Sketchbook": "Cuaderno de Dibujo (Sketchbook)",
    "Wireless HDMI Transmitter": "Transmisor HDMI Inalámbrico",
    "Savory Oatmeal Cups": "Copas de Avena Salada Instantánea",
    "Camping Lantern": "Linterna Recargable de Camping",
    "Garlic Butter Sauce": "Salsa de Mantequilla de Ajo",
    "Self-Cleaning Water Bottle": "Botella de Agua Autolimpiable con UV-C",
    "Cranberry Almond Biscotti": "Biscotti de Arándano y Almendra",
    "Gardening Fairy Figurines": "Figuras de Hadas de Jardín",
    "Reversible Swimming Pool Lounger": "Colchoneta de Piscina Reversible",
    "Fridge Magnet Set": "Juego de Imanes para Refrigerador",
    "Cotton Basic Tank": "Polera de Tirantes Básica de Algodón",
    "Portable Blender": "Licuadora Portátil a Batería",
    "Frozen Pizza": "Pizza Congelada de Varios Sabores",
    "Balsamic Vinegar": "Vinagre Balsámico Rústico",
    "Mini Indoor Herb Garden Kit": "Kit de Huerto de Hierbas para Cocina",
    "Sweet Potatoes": "Camotes / Batatas Dulces",
    "Reclining Camping Chair": "Silla de Camping Reclinable con Posavasos",
    "Set of Silicone Baking Molds": "Juego de Moldes de Silicona para Hornear",
    "Vanilla Pudding Mix": "Mezcla para Pudín de Vainilla",
    "Plant Pot Drip Trays": "Bandejas de Goteo para Macetas",
    "Fresh Strawberries": "Frutillas Frescas y Dulces",
    "Stainless Steel Water Bottle": "Botella de Agua de Acero Inoxidable Insulada",
    "Pet Reflective Vest": "Chaleco Reflectante de Seguridad para Mascotas",
    "Ergonomic Mouse Pad with Wrist Support": "Mouse Pad Ergonómico con Soporte para Muñeca",
    "Skincare Fridge": "Minirefrigerador para Productos de Skincare",
    "Garlic Herb Marinade": "Marinado de Ajo y Hierbas",
    "Casual Long Cardigan": "Cardigan Largo Casual",
    "Kids' Art Supplies Kit": "Kit Completo de Arte para Niños",
    "Vegetable Medley": "Mezcla de Verduras Frescas",
    "Mini Electric Kettle": "Hervidor Eléctrico Compacto",
    "Luxury Rolling Makeup Case": "Maleta de Maquillaje Profesional con Ruedas",
    "Floral Wrap Top": "Top Floral Tipo Wrap",
    "Zesty Garlic Marinade": "Marinado de Ajo Picante y Cítrico",
    "Multi-Function Smartphone Holder": "Soporte Multifuncional para Celular",
    "Teriyaki Chicken Wings": "Alitas de Pollo Teriyaki",
    "Oven-Baked Sweet Potato Fries": "Papas Fritas de Camote al Horno",
    "Dog Training Collar": "Collar de Entrenamiento Recargable para Perros",
    "Chickpea Salad Deluxe": "Ensalada Premium de Garbanzos",
    "Portable Bluetooth Speaker": "Parlante Bluetooth Portátil",
    "Digital Camera": "Cámara Digital Compacta 20MP",
    "Sriracha Sauce": "Salsa Picante Sriracha",
    "Interchangeable Watch Bands": "Correas de Reloj Intercambiables",
    "Children's Educational Puzzle": "Rompecabezas Educativo Infantil",
    "Infrared Thermometer": "Termómetro Infrarrojo Sin Contacto",
    "Stuffed Grape Leaves": "Hojitas de Parra Rellenas de Arroz",
    "Organic Quinoa Chips": "Papas Fritas de Quínoa Orgánica",
    "Cabbage Slaw Mix": "Mezcla de Ensalada de Repollo y Zanahoria",
    "Outdoor Adventure Kit": "Kit Completo de Aventura al Aire Libre",
    "Adjustable Stand for Tablets and Smartphones": "Soporte Ajustable para Tablet y Celular",
    "Butternut Squash Ravioli": "Ravioles de Zapallo Butternut",
    "Bamboo Toothbrush": "Cepillo de Dientes de Bambú Ecológico",
    "Raspberry Lemonade Mix": "Mezcla para Limonada de Frambuesa"
  },
  // Descripciones
  descriptions: {
    "Just add water for delicious brownies.": "Solo agrega agua para preparar deliciosos brownies.",
    "A rich coconut curry sauce perfect for simmering vegetables or meats.": "Una rica salsa de curry de coco perfecta para cocinar a fuego lento verduras o carnes.",
    "Pitted black olives, perfect for salads and pizzas.": "Aceitunas negras sin carozo, perfectas para ensaladas y pizzas.",
    "Dairy-free ice cream made with coconut milk, creamy and delicious.": "Helado sin lácteos elaborado con leche de coco, cremoso y delicioso.",
    "A convenient powder mix combining greens and fruits for smoothies.": "Una práctica mezcla en polvo que combina verduras y frutas para batidos.",
    "Delicious plant-based burger made with organic black beans and spices.": "Deliciosa hamburguesa vegetal hecha con porotos negros orgánicos y especias.",
    "Flavorful chicken sausage, low in fat and fully cooked.": "Salchicha de pollo sabrosa, baja en grasa y completamente cocida.",
    "Shredded potatoes, perfect for breakfasts.": "Papas ralladas, perfectas para desayunos.",
    "Wireless trackpad for enhanced laptop navigation.": "Trackpad inalámbrico para una mejor navegación en laptop.",
    "Soft hamburger buns made with whole grains.": "Panes de hamburguesa suaves hechos con granos enteros.",
    "Secure digital wireless security camera system.": "Sistema de cámara de seguridad inalámbrica digital segura.",
    "A zesty salsa made with peaches and mangos, great for chips.": "Una salsa picante hecha con duraznos y mangos, ideal para papas fritas.",
    "A spicy marinade perfect for chicken and fish.": "Un marinado picante perfecto para pollo y pescado.",
    "Creamy and crumbly cheese for salads and dishes.": "Queso feta cremoso y desmenuzable para ensaladas y platos.",
    "Multi-functional gloves for planting and digging without tools.": "Guantes multifuncionales para plantar y cavar sin herramientas.",
    "Reusable suction cup hooks for hanging items.": "Ganchos de ventosa reutilizables para colgar artículos.",
    "Roasted cashews coated in honey and sesame seeds for a sweet treat.": "Castañas de cajú tostadas recubiertas de miel y sésamo para un dulce regalo.",
    "Fun gardening tools designed specifically for kids.": "Divertidas herramientas de jardinería diseñadas especialmente para niños.",
    "Double-sided art easel for painting and drawing.": "Caballete de arte de doble cara para pintar y dibujar.",
    "Eco-friendly electric bike with a 30-mile range.": "Bicicleta eléctrica ecológica con una autonomía de 48 kilómetros.",
    "Compact travel organizer for accessories and toiletries.": "Organizador de viaje compacto para accesorios y artículos de aseo.",
    "Pasta tossed with fresh basil pesto, simple and delicious.": "Pasta mezclada con pesto de albahaca fresca, sencilla y deliciosa.",
    "Quote wall art to inspire and motivate.": "Arte de pared con frases para inspirar y motivar.",
    "A mix of fresh raspberries, blueberries, and blackberries.": "Una mezcla de frambuesas, arándanos y moras frescas.",
    "Therapeutic weighted blanket for better sleep.": "Manta de peso terapéutica para un mejor sueño.",
    "Gluten-free flour made from ground chickpeas, great for cooking.": "Harina sin gluten hecha de garbanzos molidos, ideal para cocinar.",
    "Eco-friendly bamboo cutting board for food prep.": "Tabla de cortar de bambú ecológica para la preparación de alimentos.",
    "Aromatic long-grain basmati rice, perfect for curries.": "Arroz basmati aromático de grano largo, perfecto para curries.",
    "Complete set for grilling and tailgating fun.": "Juego completo para asar a la parrilla y divertirse al aire libre.",
    "Set of reusable stainless steel straws for drinks.": "Juego de bombillas reutilizables de acero inoxidable para bebidas.",
    "Stay warm with this stylish knit beanie in various colors.": "Mantente abrigado con este elegante gorro de lana en varios colores.",
    "Tool to check car engine codes and performance issues.": "Herramienta para verificar códigos de motor de autos y problemas de rendimiento.",
    "Ready-to-eat avocado slices, perfect for tacos.": "Láminas de palta listas para comer, perfectas para tacos.",
    "Smart robotic vacuum for automatic cleaning.": "Aspiradora robot inteligente para limpieza automática.",
    "Frozen smoothie pack with strawberries and bananas.": "Pack de batido congelado con frutillas y plátanos.",
    "Assorted fruit-flavored gummy snacks that kids love.": "Gomitas de frutas variadas que a los niños les encantan.",
    "Instant oats with a savory twist, such as herbs and spices.": "Avena instantánea con un toque salado de hierbas y especias.",
    "A hearty salad with lentils, veggies, and curry dressing.": "Una ensalada abundante con lentejas, verduras y aderezo de curry.",
    "Sweet and tangy balsamic reduction for drizzling.": "Reducción balsámica dulce y picante para rociar.",
    "Intricate designs for adults to relax and unwind.": "Diseños complejos para que los adultos se relajen y desconecten.",
    "Nutritious bars packed with protein for energy": "Barras nutritivas cargadas de proteínas para dar energía.",
    "Pure and natural honey, great for sweetening.": "Miel pura y natural, ideal para endulzar.",
    "Handy dispenser for quick access to safety pins.": "Práctico dispensador para un acceso rápido a los alfileres de gancho.",
    "Bell peppers filled with quinoa and vegetables.": "Pimientos rellenos de quínoa y verduras.",
    "Crunchy cacao nibs, great for adding to smoothies or baking.": "Nibs de cacao crujientes, ideales para añadir a batidos o repostería.",
    "High-quality sketchbook for artists.": "Cuaderno de bocetos de alta calidad para artistas.",
    "Stream HD video wirelessly to your TV.": "Transmite video HD de forma inalámbrica a tu televisor.",
    "Savory oatmeal ready to eat, great for breakfast or a snack.": "Avena salada lista para comer, ideal para el desayuno o la merienda.",
    "Rechargeable LED camping lantern for outdoor use.": "Linterna LED de camping recargable para uso al aire libre.",
    "A rich sauce perfect for pasta or drizzling over vegetables.": "Una rica salsa perfecta para pasta o para rociar sobre verduras.",
    "Water bottle with built-in UV-C light for self-cleaning.": "Botella de agua con luz UV-C integrada para autolimpieza.",
    "Crispy and delicious biscotti flavored with cranberry and almond.": "Biscotti crujiente y delicioso con sabor a arándano y almendra.",
    "Cute fairy figurines to decorate your garden or potted plants.": "Lindas figuras de hadas para decorar tu jardín o plantas en macetas.",
    "Floating lounger for relaxation in swimming pools or lakes.": "Tumbona flotante para relajarse en piscinas o lagos.",
    "Fun fridge magnets to decorate your kitchen.": "Divertidos imanes de refrigerador para decorar tu cocina.",
    "Essential cotton tank top, perfect for layering.": "Polera de tirantes básica de algodón esencial, perfecta para combinar.",
    "Battery-operated blender for smoothies on the go.": "Licuadora portátil a batería para batidos sobre la marcha.",
    "Delicious frozen pizza with a variety of toppings.": "Deliciosa pizza congelada con una variedad de ingredientes.",
    "Rich and tangy balsamic vinegar, perfect for dressings.": "Vinagre balsámico rico y picante, perfecto para aderezos.",
    "All-in-one kit for growing herbs in your kitchen.": "Kit todo en uno para cultivar hierbas aromáticas en tu cocina.",
    "Sweet and nutritious potatoes, great for roasting.": "Camotes dulces y nutritivos, ideales para asar.",
    "Foldable reclining camping chair with cup holder.": "Silla de camping plegable y reclinable con posavasos.",
    "Flexible molds perfect for baking cakes and pastries.": "Moldes flexibles perfectos para hornear pasteles y repostería.",
    "Instant mix for creamy vanilla pudding.": "Mezcla instantánea para pudín de vainilla cremoso.",
    "Prevent water damage with drip trays for potted plants.": "Evita daños por agua con bandejas de goteo para plantas en macetas.",
    "Sweet and juicy strawberries, perfect for desserts.": "Frutillas dulces y jugosas, perfectas para postres.",
    "Durable and insulated water bottle to keep beverages cold.": "Botella de agua duradera e insulada para mantener las bebidas frías.",
    "Safety vest for pets during nighttime walks.": "Chaleco de seguridad reflectante para mascotas durante paseos nocturnos.",
    "Comfortable mouse pad designed to reduce wrist strain.": "Cómodo mouse pad diseñado para reducir la tensión en la muñeca.",
    "Small fridge designed to keep skincare products cool and fresh.": "Pequeño refrigerador diseñado para mantener frescos los productos de cuidado de la piel.",
    "A savory marinade for meats, perfect for grilling.": "Un adobo sabroso para carnes, perfecto para la parrilla.",
    "A cozy long cardigan designed for layering in any season.": "Un cardigan largo y acogedor diseñado para vestir en capas en cualquier estación.",
    "Complete kit with crayons, markers, and paper for young artists.": "Kit completo con lápices de cera, marcadores y papel para jóvenes artistas.",
    "Mixed fresh vegetables for stir-frying or roasting.": "Verduras frescas mixtas para saltear o asar.",
    "Quick boiling kettle for small kitchens and dorms.": "Hervidor eléctrico de ebullición rápida para cocinas pequeñas y dormitorios.",
    "Stylish and spacious case for makeup and beauty products.": "Estuche de maquillaje elegante y espacioso para productos de belleza.",
    "A feminine wrap top with a beautiful floral print.": "Un top femenino tipo wrap con un hermoso estampado floral.",
    "A tangy marinade for meats and veggies, packed with garlic flavor.": "Un marinado picante para carnes y verduras, cargado de sabor a ajo.",
    "Versatile holder that can be used on desks, cars, and more.": "Soporte versátil que se puede usar en escritorios, autos y más.",
    "Flavorful chicken wings marinated in a sweet teriyaki glaze.": "Sabrosas alitas de pollo marinadas en un glaseado dulce de teriyaki.",
    "Crispy sweet potato fries, perfectly seasoned and baked to perfection.": "Bastones crujientes de camote, perfectamente sazonados y horneados a la perfección.",
    "Rechargeable training collar for effective behavior training.": "Collar de adiestramiento recargable para un entrenamiento eficaz del comportamiento de perros.",
    "Chickpeas mixed with fresh vegetables and herbs, a nutritious snack or salad.": "Garbanzos mezclados con verduras frescas y hierbas, un refrigerio o ensalada nutritiva.",
    "Compact Bluetooth speaker with rich sound quality.": "Parlante Bluetooth compacto con rica calidad de sonido.",
    "Compact digital camera with 20MP resolution.": "Cámara digital compacta con resolución de 20 megapíxeles.",
    "Spicy chili sauce for an extra kick in your meals.": "Salsa picante de chile para dar un toque extra a tus comidas.",
    "Set of stylish watch bands to customize your look.": "Juego de elegantes correas de reloj para personalizar tu estilo.",
    "Fun educational puzzle set for kids.": "Divertido juego de rompecabezas educativo para niños.",
    "Non-contact thermometer for checking temperatures instantly.": "Termómetro sin contacto para comprobar temperaturas al instante.",
    "Grape leaves stuffed with rice and herbs, ready to eat.": "Hojas de parra rellenas con arroz y hierbas aromáticas, listas para comer.",
    "Light and crispy chips made from quinoa, ideal for dipping.": "Papas fritas de quínoa ligeras y crujientes, ideales para untar.",
    "Fresh cabbage and carrot slaw mix for salads.": "Mezcla de repollo y zanahoria fresca para ensaladas.",
    "Complete outdoor kit for camping and hiking.": "Kit completo al aire libre para camping y senderismo.",
    "Multi-angle stand for easy viewing of devices.": "Soporte multiángulo para una fácil visualización de dispositivos.",
    "Delicate ravioli filled with roasted butternut squash and spices, perfect with a sage butter sauce.": "Delicados ravioles rellenos de zapallo butternut asado y especias, perfectos con salsa de mantequilla de salvia.",
    "Eco-friendly bamboo toothbrush for sustainable living.": "Cepillo de dientes de bambú ecológico para un estilo de vida sustentable.",
    "A refreshing drink mix that combines sweet raspberries and tart lemons, perfect for summer.": "Una refrescante mezcla de bebida que combina frambuesas dulces y limones ácidos, perfecta para el verano."
  }
};

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB para la migración.');

    const products = await Product.find({});
    console.log(`Se encontraron ${products.length} productos en la base de datos.`);

    let countTranslated = 0;
    let countConverted = 0;

    for (let product of products) {
      let needsSave = false;

      // 1. Conversión de nombre
      if (translationDict.names[product.name]) {
        product.name = translationDict.names[product.name];
        needsSave = true;
        countTranslated++;
      }

      // 2. Conversión de descripción
      if (product.description && translationDict.descriptions[product.description]) {
        product.description = translationDict.descriptions[product.description];
        needsSave = true;
      }

      // 3. Conversión de precio de USD a CLP
      // Se multiplican solo los precios que sean menores a 1000 (claramente en USD)
      if (product.price < 1000) {
        const oldPrice = product.price;
        product.price = product.price * 900;
        needsSave = true;
        countConverted++;
        console.log(`Conversión de precio para "${product.name}": USD $${oldPrice} -> CLP $${product.price}`);
      }

      if (needsSave) {
        await product.save();
      }
    }

    console.log('\nMIGRACIÓN COMPLETADA EXITOSAMENTE:');
    console.log(`- Productos traducidos al español: ${countTranslated}`);
    console.log(`- Precios convertidos de USD a CLP: ${countConverted}`);
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

migrate();
