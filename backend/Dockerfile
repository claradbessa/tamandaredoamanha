FROM php:8.3-fpm-alpine

# Instala dependências, incluindo as para manipulação de imagem (gd) e zip
RUN apk add --no-cache git nginx supervisor shadow postgresql-dev \
    libzip-dev \
    libpng-dev \
    jpeg-dev \
    freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql zip gd

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia a configuração de upload para o PHP
COPY docker/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/html
COPY . .

# Copia as configurações do Nginx, Supervisor e o script de inicialização
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Instala dependências do Composer
ENV COMPOSER_MEMORY_LIMIT=-1
RUN composer install --no-dev --optimize-autoloader

# Adiciona o link simbólico do storage
RUN php artisan storage:link

# Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["/usr/local/bin/start.sh"]
