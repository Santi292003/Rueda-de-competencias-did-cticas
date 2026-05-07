#!/bin/bash

echo "🔨 Generando build..."
npm run build

echo "📦 Copiando al servidor..."
scp -r dist/* testserver@172.16.1.21:/var/www/rueda-competencias/

echo "✅ Desplegado en http://172.16.1.21/rueda/"