# Guía de Configuración del Sistema Operativo (entorno virtualizado)

Esta guía cubre pasos mínimos para preparar una máquina virtual Ubuntu 22.04 LTS para desplegar ComercioTech y MongoDB.

1) Crear VM (cloud o local) con 2+ CPUs, 4+ GB RAM (producción: ajustar según volúmenes)

2) Actualizar paquetes

```bash
sudo apt update && sudo apt upgrade -y
```

3) Crear usuario no-root y habilitar `sudo`

```bash
sudo adduser ctuser
sudo usermod -aG sudo ctuser
```

4) Instalar herramientas básicas

```bash
sudo apt install -y curl wget git ufw
```

5) Configurar firewall básico

```bash
sudo ufw allow OpenSSH
sudo ufw allow 5001/tcp   # puerto backend
sudo ufw allow 27017/tcp  # puerto MongoDB (no exponer públicamente en producción)
sudo ufw enable
```

6) Configuración de disco y snapshots
- Montar discos de datos en `/var/lib/mongo` o usar volúmenes gestionados.
- Habilitar snapshots periódicos en el proveedor de la nube.

7) Recomendaciones de seguridad
- No exponer MongoDB directamente a Internet; ponerlo en red privada o usar túnel/VPC.\
- Habilitar TLS y autenticación en MongoDB para producción.\
- Mantener OS actualizado y revisar logs regularmente.
