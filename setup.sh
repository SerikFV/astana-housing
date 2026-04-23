#!/bin/bash
# Astana Housing — толық орнату скрипті

echo "🚀 Astana Housing орнатылуда..."

# SSL папкасы жасау
mkdir -p nginx/ssl

# Self-signed SSL сертификат жасау
echo "🔐 SSL сертификат жасалуда..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out    nginx/ssl/cert.pem \
  -subj "/C=KZ/ST=Astana/L=Astana/O=AstanaHousing/CN=localhost" 2>/dev/null

echo "✅ SSL сертификат дайын"

# Docker Compose іске қосу
echo "🐳 Docker контейнерлері іске қосылуда..."
docker-compose up -d --build

echo ""
echo "✅ Барлығы іске қосылды!"
echo ""
echo "🌐 Сайт:       https://localhost"
echo "📊 Grafana:    http://localhost:3000  (admin / admin123)"
echo "📈 Prometheus: http://localhost:9090"
echo "🔧 Backend:    http://localhost:3001/api/health"
