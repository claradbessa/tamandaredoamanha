#!/bin/sh
set -e

echo "Ajustando permissões..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "Rodando migrations..."
php artisan migrate --force

echo "Iniciando supervisord..."
/usr/bin/supervisord -c /etc/supervisord.conf