# Guía de Instalación y Configuración de MongoDB

## Panorama
Incluye instrucciones rápidas para instalar MongoDB Community en Ubuntu, macOS y Windows, además de recomendaciones de seguridad para producción.

## Ubuntu (p.ej. 22.04)
1. Importar la clave y añadir repositorio oficial, luego instalar:

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
```

2. Habilitar autenticación (editar `/etc/mongod.conf`):

```yaml
security:
  authorization: "enabled"
```

3. Configurar TLS: generar certificado y configurar `net.tls` en `mongod.conf`.

4. Crear usuario administrador:

```bash
mongo --eval 'db.getSiblingDB("admin").createUser({user: "admin", pwd: "<strong-password>", roles:[{role:"root",db:"admin"}]})'
```

## macOS (Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

## Windows
- Instalar desde el MSI oficial y configurar `mongod.cfg`. Habilitar servicio y seguir pasos similares de creación de usuarios y TLS.

## Recomendaciones de seguridad (producción)
- Usar Replica Set con al menos 3 nodos.\
- Forzar TLS entre clientes y servidores.\
- No exponer puerto 27017 públicamente; usar VPC o túneles.\
- Habilitar audit logs si se necesita trazabilidad.\
- Backups: snapshots diarios + backups incrementales.
