#!/bin/sh
set -e

echo "Corrigindo permissões de pastas..."
chmod 1777 /tmp
mkdir -p /var/www/html/storage/app/public
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

echo "===== Variáveis de ambiente carregadas no container ====="
echo "APP_ENV=$APP_ENV"
echo "APP_DEBUG=$APP_DEBUG"
echo "FILESYSTEM_DISK=$FILESYSTEM_DISK"
echo "========================================================="

echo "Limpando caches para garantir leitura das variáveis de ambiente em tempo real..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Criando link de armazenamento..."
rm -rf /var/www/html/public/storage
php artisan storage:link

echo "Aguardando o banco de dados e rodando migrations..."
until php artisan migrate --force; do
  echo "Banco ainda não pronto, tentando novamente em 3 segundos..."
  sleep 3
done

echo "Iniciando supervisord..."
/usr/bin/supervisord -c /etc/supervisord.conf
