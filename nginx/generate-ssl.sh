#!/bin/sh
# Self-signed SSL сертификат жасау (dev үшін)
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out    /etc/nginx/ssl/cert.pem \
  -subj "/C=KZ/ST=Astana/L=Astana/O=AstanaHousing/CN=localhost"
echo "✅ SSL сертификат жасалды"
