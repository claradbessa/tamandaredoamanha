#!/bin/sh
set -e

# Garante permissão de escrita na pasta de uploads temporários do sistema
chmod 1777 /tmp

# Cria as pastas necessárias e garante as permissões corretas
mkdir -p /var/www/html/storage/app/public
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

echo "Aguardando o banco de dados e rodando migrations..."
until php artisan migrate --force; do
  echo "O banco de dados não está pronto, tentando novamente em 3 segundos..."
  sleep 3
done

echo "Cacheando configuração e rotas..."
php artisan config:cache
php artisan route:cache

echo "Criando o link de armazenamento..."
# Apaga o link antigo se existir e cria o novo
rm -rf /var/www/html/public/storage
php artisan storage:link

echo "Iniciando supervisord..."
/usr/bin/supervisord -c /etc/supervisord.conf
