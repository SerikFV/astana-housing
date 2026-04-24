# Astana Housing — Windows setup script

Write-Host "Astana Housing ornatyluda..." -ForegroundColor Cyan

# SSL papkasy jasau
New-Item -ItemType Directory -Path "nginx/ssl" -Force | Out-Null

# SSL sertifikat Docker arqyly jasau
Write-Host "SSL sertifikat jasalyuda..." -ForegroundColor Yellow
docker run --rm -v "${PWD}/nginx/ssl:/ssl" alpine/openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout /ssl/key.pem `
  -out    /ssl/cert.pem `
  -subj "/C=KZ/ST=Astana/L=Astana/O=AstanaHousing/CN=localhost" 2>$null
Write-Host "SSL sertifikat dayin" -ForegroundColor Green

# Docker Compose (PostgreSQL, Grafana, Prometheus, Jenkins, n8n...)
Write-Host "Docker konteinerleri iske kosyluda..." -ForegroundColor Yellow
docker-compose up -d --build

# 3001 portty bosatu (eger alyngan bolsa)
$connections = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
foreach ($conn in $connections) {
    if ($conn.OwningProcess -gt 4) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# Backend fonда іске қосу
Write-Host "Backend iske kosyluda..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Frontend фонда іске қосу
Write-Host "Frontend iske kosyluda..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Barlygy dayin!" -ForegroundColor Green
Write-Host ""
Write-Host "Sait:       http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:    http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host "Grafana:    http://localhost:3000  (admin / admin123)" -ForegroundColor Cyan
Write-Host "Prometheus: http://localhost:9090" -ForegroundColor Cyan
Write-Host "Jenkins:    http://localhost:8080" -ForegroundColor Cyan
Write-Host "n8n:        http://localhost:5678  (admin / admin123)" -ForegroundColor Cyan
