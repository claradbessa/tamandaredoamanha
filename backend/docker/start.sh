#!/bin/sh

# Cria o diretório de runtime para o Nginx e ajusta permissões
mkdir -p /run/nginx
chown -R www-data:www-data /run/nginx

# Ajusta permissões do storage e cache (redundância para garantir)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Inicia os serviços usando o arquivo de configuração padrão
/usr/bin/supervisord -c /etc/supervisord.conf
