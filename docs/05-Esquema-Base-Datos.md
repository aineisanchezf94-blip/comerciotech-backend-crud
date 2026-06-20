# Esquema de la Base de Datos — ComercioTech

## Modelos

### Client
Ejemplo de documento:

```json
{
  "_id": "64a...",
  "name": "María Pérez",
  "email": "maria@example.com",
  "phone": "555-0001",
  "address": "Calle Uno 123",
  "createdAt": "2026-06-20T...",
  "updatedAt": "2026-06-20T..."
}
```

Índices: `email` está definido como `unique` en el esquema.

### Product
Ejemplo:

```json
{
  "_id": "64b...",
  "name": "Auriculares Bluetooth",
  "description": "Negro con cancelación",
  "price": 79.9,
  "stock": 50,
  "createdAt": "2026-06-20T..."
}
```

Índices sugeridos: índice por `name` para búsquedas textuales; considerar índices compuestos si hay filtros por precio/rango.

### Order
Ejemplo:

```json
{
  "_id": "64c...",
  "client": "64a...",
  "products": [ { "product": "64b...","quantity": 2 } ],
  "totalAmount": 179.3,
  "status": "Pendiente",
  "createdAt": "2026-06-20T..."
}
```

Relaciones: orders usan referencias (`ObjectId`) a `Client` y `Product`. Esta estrategia (referencing) es apropiada si los productos y clientes se gestionan de forma independiente y hay consultas para poblar referencias (como `.populate()`).

## Estrategia de modelado
- Datos maestros (clientes, productos) en colecciones separadas; pedidos referencian por ID.\
- Para cargas muy altas donde se lean pedidos con mucha frecuencia, considerar denormalizar algunas propiedades (p.ej. `productName`, `unitPrice` al momento de crear la orden) para evitar joins costosos y preservar histórico ante cambios de precio.
