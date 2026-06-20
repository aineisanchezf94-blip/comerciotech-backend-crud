# Justificación del Sistema Operativo para ComercioTech

## Resumen
Para el despliegue de ComercioTech (MongoDB + Node.js) se recomienda Linux (distribución Ubuntu LTS) en producción por estabilidad, soporte y ecosistema de herramientas de servidor. Para desarrollo local, macOS y Windows son aceptables.

## Criterios evaluados
- Compatibilidad con MongoDB: MongoDB soporta Linux, macOS y Windows; en producción Linux recibe mayor soporte y facilidad de automatización.
- Rendimiento y estabilidad: Linux suele ofrecer mejor gestión de I/O y menor overhead para servidores.
- Administración y despliegue: herramientas como systemd, docker, orchestration (Kubernetes) funcionan nativamente en Linux.
- Seguridad: SELinux/AppArmor y opciones de hardening están maduras en Linux.

## Recomendación
- Producción: Ubuntu LTS (22.04+). Ejecutar MongoDB en servidores Linux, preferiblemente en instancias con SSD y IOPS garantizadas.
- Desarrollo: macOS (si el equipo de desarrollo lo usa) o Windows con WSL2 — ambos válidos para desarrollo local.

## Notas adicionales
- Para alta disponibilidad y escalado, usar servicios gestionados (MongoDB Atlas) o desplegar Replica Sets en Linux. Si se elige nube, seguir recomendaciones del proveedor para tamaño y IOPS.
