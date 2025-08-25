FROM php:8.3-fpm-alpine

# ETAPA 1: Instala as dependências do sistema
RUN apk add --no-cache --update \
    git \
    nginx \
    supervisor \
    shadow \
    postgresql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    curl-dev \
    oniguruma-dev \
    bash

# ETAPA 2: Instala as extensões do PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg=/usr/include \
    && docker-php-ext-install -j$(nproc) \
       pdo \
       pdo_pgsql \
       zip \
       gd \
       curl \
       ctype \
       fileinfo \
       mbstring

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copia config de upload do PHP
COPY docker/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# Define pasta de trabalho
WORKDIR /var/www/html

# Copia o código da aplicação
COPY . .

# Copia configs do Nginx, Supervisor e script de start
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Instala dependências do Composer
ENV COMPOSER_MEMORY_LIMIT=-1
RUN composer install --no-dev --optimize-autoloader

# Cria pastas necessárias e ajusta permissões
RUN mkdir -p /var/www/html/storage/app/public/uploads/midia \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Garante que o link simbólico do storage seja criado
RUN php artisan storage:link || true

EXPOSE 80

# Comando para iniciar
CMD ["/usr/local/bin/start.sh"]
