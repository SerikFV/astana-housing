# Astana Housing — DevOps Жобасы

**Студенттер:** Файзуллаев Серик, Бердімұрат Жасұлан, Тойлыбай Амина  
**GitHub:** https://github.com/SerikFV/astana-housing  
**Жоба тақырыбы:** Астана қаласының тұрғын үй нарығын талдайтын веб-қосымша

---

## Жоба туралы

Astana Housing — Астана қаласындағы пәтерлер нарығын талдауға арналған толық стекті веб-қосымша. Жоба барлық заманауи DevOps тәжірибелерін қамтиды: контейнерлеу, мониторинг, CI/CD, IaC және жасанды интеллект интеграциясы.

---

## 1. Операциялық жүйе

- **Docker Desktop** арқылы Linux контейнерлері (Alpine Linux, Node.js)
- Барлық сервистер изоляцияланған контейнерлерде жұмыс істейді
- `docker-compose up -d` — бір командамен бәрі іске қосылады

---

## 2. Қауіпсіздік және Желі

| Компонент | Сипаттама |
|---|---|
| **SSL сертификат** | Self-signed, `nginx/ssl/cert.pem` |
| **Nginx Reverse Proxy** | HTTP (80) → HTTPS (443) redirect |
| **Авторизация** | bcrypt хэш, PostgreSQL-де сақталады |
| **Backup** | `ansible/backup.yml` — PostgreSQL dump автоматты |

```
Клиент → Nginx (443/SSL) → Frontend → Backend → PostgreSQL
```

---

## 3. Дерекқор (PostgreSQL)

**4 кесте:**

```sql
users       — пайдаланушылар (email, bcrypt пароль, role)
apartments  — 56 пәтер (баға, аудан, координаттар)
favorites   — таңдаулылар
feedback    — пікірлер мен рейтингтер
```

**Деректер:** Астананың 6 ауданынан 56 нақты пәтер (krisha.kz)

**API endpoints:**
- `POST /api/auth/signin` — кіру
- `POST /api/auth/signup` — тіркелу
- `GET /api/apartments` — пәтерлер тізімі
- `GET /api/statistics` — нарық статистикасы
- `GET/POST /api/favorites` — таңдаулылар
- `GET/POST /api/feedback` — пікірлер

---

## 4. Веб-қосымша (App)

**Технологиялар:**
- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- БД: PostgreSQL 16
- Карта: Leaflet / OpenStreetMap
- Графиктер: Recharts

**Беттер:**
| Бет | Сипаттама |
|---|---|
| Басты бет | Жоба туралы, статистика |
| Пәтерлер | Тізім, фильтр (аудан, бөлме, баға) |
| Карта | Пәтерлер картада, маршрут |
| Статистика | Диаграммалар, нарық талдауы |
| AI Чат | Groq AI арқылы кеңес |
| Профиль | Таңдаулылар, пікірлер |
| Админ | Пайдаланушылар басқару |

---

## 5. Контейнерлеу (Docker)

**11 сервис** `docker-compose.yml`-де:

```
postgres        — PostgreSQL 16
backend         — Express API (port 3001)
frontend        — React + Nginx (port 80)
nginx           — Reverse Proxy (port 443)
prometheus      — Метрика жинау (port 9090)
grafana         — Визуализация (port 3000)
alertmanager    — Алерт басқару (port 9093)
node-exporter   — Сервер метрикалары (port 9100)
telegram-bot    — Алерт хабарламалары
jenkins         — CI/CD (port 8080)
n8n             — AI workflow (port 5678)
```

**Іске қосу:**
```powershell
.\setup.ps1
```

---

## 6. Нұсқаларды басқару (Git)

- **Репозиторий:** https://github.com/SerikFV/astana-housing
- **Барлық файлдар:** 89+ файл, 8000+ жол код
- **Commit тарихы:** GitHub-та көруге болады

```bash
git clone https://github.com/SerikFV/astana-housing.git
```

---

## 7. Мониторинг

### Prometheus + Node Exporter
- CPU, RAM, Диск метрикалары жиналады
- Backend HTTP сұраулары саналады (`/api/metrics`)

### Grafana Dashboard
- URL: http://localhost:3000 (admin / admin123)
- **"Astana Housing Monitor"** dashboard:
  - CPU пайдалану (%)
  - Жад пайдалану (%)
  - HTTP сұраулар графигі
  - Сервис статусы

### Telegram Bot Alerts
- **BackendDown** — Backend өшсе 1 минутта хабарлама
- **HighCPUUsage** — CPU 80%+ болса
- **LowMemory** — RAM 20%- қалса
- **LowDiskSpace** — Диск 15%- қалса

### Jenkins CI/CD
- URL: http://localhost:8080
- GitHub-пен интеграция
- Автоматты тест + деплой
- Telegram-ға BUILD SUCCESS/FAILED хабарламасы

---

## 8. Жасанды Интеллект (AI)

### Groq AI (ChatPage)
- Модель: `llama-3.1-8b-instant`
- Астана тұрғын үй нарығы бойынша кеңес береді
- Қазақ тілінде жауап береді

### n8n Workflow
- URL: http://localhost:5678 (admin / admin123)
- **Схема:** Webhook → Groq AI → Telegram + Response
- Сайттан сұрақ жазылса → AI жауап береді → Telegram-ға да жіберіледі

---

## 9. Автоматтандыру (IaC)

### Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply
```
PostgreSQL, Prometheus, Grafana, Node Exporter контейнерлерін код ретінде сипаттайды.

### Ansible
```bash
# Толық орнату
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

# Backup жасау
ansible-playbook -i ansible/inventory.ini ansible/backup.yml

# Monitoring тексеру
ansible-playbook -i ansible/inventory.ini ansible/monitoring.yml
```

---

## Жобаны іске қосу

```powershell
# 1. Docker Desktop ашасың

# 2. Терминал 1 — барлық сервистер
.\setup.ps1

# 3. Терминал 2 — Backend
cd server
npm run dev

# 4. Терминал 3 — Frontend
npm run dev
```

| Сервис | URL |
|---|---|
| Сайт | http://localhost:5173 |
| Backend | http://localhost:3001/api/health |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Jenkins | http://localhost:8080 |
| n8n | http://localhost:5678 |

---

## Жоба құрылымы

```
astana-housing/
├── src/                    # React frontend
├── server/                 # Express backend
├── database/               # PostgreSQL schema + seed
├── nginx/                  # Nginx + SSL конфигурация
├── monitoring/             # Prometheus, Grafana, Alertmanager
├── terraform/              # IaC — инфрақұрылым коды
├── ansible/                # Сервер автоматтандыру
├── n8n/                    # AI workflow
├── docker-compose.yml      # Барлық сервистер
├── Jenkinsfile             # CI/CD pipeline
└── setup.ps1               # Бір командамен іске қосу
```
