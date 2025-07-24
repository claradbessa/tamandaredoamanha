#!/bin/sh
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
