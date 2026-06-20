Resumen de cambios y cómo continuar

- Añadidos `docs/` con los entregables solicitados (requisitos, SO, guías, esquema, código). 
- Añadido `docker-compose.yml` para levantar MongoDB y backend en desarrollo.
- Añadido `backend/src/seed.js` para insertar datos de ejemplo.
- Actualizado `backend/src/config/db.js` para usar URI por defecto en desarrollo.
- Actualizado `backend/package.json` con script `seed`.

Siguientes pasos recomendados:
- Ejecutar `docker-compose up --build -d` y luego `npm run seed` dentro de `backend`.
- Revisar y completar documentos con políticas GDPR y estimaciones de carga (si se requieren más detalles).
