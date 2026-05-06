#!/bin/bash

echo "🔨 Generando build..."
npm run build

echo "📦 Copiando al servidor..."
scp -r dist/* testserver@172.16.1.21:/var/www/rueda-competencias/

echo "🔑 Ajustando permisos..."
ssh testserver@172.16.1.21 "sudo chmod -R 755 /var/www/rueda-competencias && sudo chown -R www-data:www-data /var/www/rueda-competencias"

echo "✅ Desplegado en http://172.16.1.21/rueda/"