#!/bin/sh
set -e

# Ajustando limites do PHP para upload grande
echo "upload_max_filesize=20M" >> /usr/local/etc/php/conf.d/uploads.ini
echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/uploads.ini

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

echo "Limpando caches antigos..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo "Recriando caches de configuração e rotas para produção..."
php artisan config:cache
php artisan route:cache

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
