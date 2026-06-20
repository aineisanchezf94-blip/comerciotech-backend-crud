#!/bin/bash

# Script de inicio rápido para ComercioTech con Docker

set -e

echo "🚀 ComercioTech - Iniciando con Docker Compose..."
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Descargalo en https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado."
    exit 1
fi

echo "✅ Docker y Docker Compose detectados"
echo ""

# Construir y levantarservicios
echo "📦 Construyendo imágenes y levantando servicios..."
docker-compose up --build -d

echo ""
echo "⏳ Esperando a que MongoDB esté listo..."
sleep 10

# Verificar que los servicios estén corriendo
echo ""
echo "✅ Servicios levantados:"
docker-compose ps

echo ""
echo "📝 Insertando datos de ejemplo en MongoDB..."
docker-compose exec -T backend npm run seed

echo ""
echo "✅ ¡Listo! ComercioTech está corriendo:"
echo ""
echo "   🌐 Frontend:    http://localhost:3000"
echo "   🔌 Backend:     http://localhost:5001/api"
echo "   💾 MongoDB:     localhost:27017"
echo "   ❤️ Health:      http://localhost:5001/api/health"
echo ""
echo "📊 Ver logs en tiempo real:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener:"
echo "   docker-compose down"
echo ""
