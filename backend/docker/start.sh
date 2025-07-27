#!/bin/sh

# Otimiza a configuração e as rotas usando as variáveis de ambiente do Render

set -e

echo "Ajustando permissões..."
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

echo "Cacheando configuração e rotas..."
php artisan config:cache
php artisan route:cache

echo "Rodando migrations..."
php artisan migrate --force

echo "Iniciando supervisord..."
/usr/bin/supervisord -c /etc/supervisord.conf
