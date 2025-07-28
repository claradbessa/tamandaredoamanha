#!/bin/sh
set -e

echo "Ajustando permissões..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "Aguardando o banco de dados e rodando migrations..."
# Usei migrate --force para aplicar novas migrations sem apagar os dados existentes
until php artisan migrate --force; do
  echo "O banco de dados não está pronto, tentando novamente em 3 segundos..."
  sleep 3
done

echo "Cacheando configuração e rotas..."
php artisan config:cache
php artisan route:cache

echo "Criando o link de armazenamento..."
php artisan storage:link

echo "Iniciando supervisord..."
/usr/bin/supervisord -c /etc/supervisord.conf
