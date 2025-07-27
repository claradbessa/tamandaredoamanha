FROM php:8.3-fpm-alpine

# Instala dependências, incluindo as do PostgreSQL
RUN apk add --no-cache nginx supervisor shadow postgresql-dev && \
    docker-php-ext-install pdo pdo_pgsql pdo_mysql

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www/html

# Copia os arquivos da aplicação
COPY . .

# Copia as configurações do Nginx, Supervisor e o script de inicialização
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Instala dependências do Composer
RUN composer install --no-dev --optimize-autoloader

# Cria o cache de configuração para otimizar a performance
RUN php artisan config:cache

# Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

# Comando para iniciar o servidor usando o script
CMD ["/usr/local/bin/start.sh"]
