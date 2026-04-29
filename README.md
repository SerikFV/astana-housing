# 🏠 Астана Баспана — DevOps Жобасы

<div align="center">

![Астана Баспана](src/assets/images/logo.png)

**Астана қаласының тұрғын үй нарығын талдайтын толық стекті веб-қосымша**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

**GitHub:** https://github.com/SerikFV/astana-housing

</div>

---

## 👥 Команда

| Аты-жөні | Рөлі |
|---|---|
| Файзуллаев Серик | Frontend, DevOps |
| Бердімұрат Жасұлан | Backend, Database |
| Тойлыбай Амина | AI Integration, Monitoring |

---

## 📋 Жоба туралы

**Астана Баспана** — Астана қаласындағы 18 000+ пәтер деректерін талдауға арналған заманауи веб-платформа. Жоба барлық DevOps тәжірибелерін қамтиды:

- 🐳 **Контейнерлеу** — Docker + Docker Compose (11 сервис)
- 🔄 **CI/CD** — Jenkins Pipeline + GitHub интеграциясы
- 📊 **Мониторинг** — Prometheus + Grafana + Telegram алерттер
- 🏗️ **IaC** — Terraform + Ansible автоматтандыру
- 🤖 **AI** — Groq LLM + n8n workflow
- 🔒 **Қауіпсіздік** — SSL/TLS, bcrypt, Nginx reverse proxy

---

## 🚀 Жылдам іске қосу

```powershell
# 1. Репозиторийді клондау
git clone https://github.com/SerikFV/astana-housing.git
cd astana-housing

# 2. Барлық сервистерді іске қосу (Docker Desktop ашық болуы керек)
.\setup.ps1

# 3. Frontend (жеке терминалда)
npm install
npm run dev

# 4. Backend (жеке терминалда)
cd server
npm install
npm run dev
```

### 🌐 Сервис URL-дары

| Сервис | URL | Логин |
|---|---|---|
| 🌐 Сайт | http://localhost:5173 | — |
| ⚙️ Backend API | http://localhost:3001/api/health | — |
| 📊 Grafana | http://localhost:3000 | admin / admin123 |
| 🔥 Prometheus | http://localhost:9090 | — |
| 🔧 Jenkins | http://localhost:8080 | admin / admin123 |
| 🔗 n8n | http://localhost:5678 | admin / admin123 |

### 👑 Админ кіру

| Email | Пароль |
|---|---|
| `admin@baspan.kz` | `Admin2025!` |
| `admin` | `admin123` |

---

## 🖥️ Веб-қосымша

### Технологиялар

**Frontend:**
- React 18 + TypeScript + Vite
- React Router v6 (SPA навигация)
- Recharts (диаграммалар)
- Leaflet / OpenStreetMap (карта)

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL 16 (pg драйвер)
- prom-client (метрикалар)
- bcrypt (пароль хэш)

### Беттер

| Бет | URL | Сипаттама |
|---|---|---|
| 🏠 Басты бет | `/home` | Санаттар, аудандар, нарық ақпараты |
| 🏢 Пәтерлер | `/apartments` | 18 000+ пәтер, фильтр, pagination |
| 🔍 Іздеу | `/search` | Атауы, мекен-жайы, аудан бойынша іздеу |
| 🗺️ Карта | `/map` | Интерактивті карта, маршрут |
| 📊 Статистика | `/statistics` | Нарық талдауы, диаграммалар |
| 🤖 ЖИ Чат | `/chat` | Баспана ЖИ кеңесші |
| ⚖️ Салыстыру | `/compare` | 3 пәтерді қатар салыстыру |
| 🕐 Тарих | `/history` | Соңғы қаралған пәтерлер |
| 👤 Профиль | `/profile` | Таңдаулылар, пікірлер |
| 🔔 Хабарлар | `/notifications` | Хабарландырулар орталығы |
| ❓ FAQ | `/faq` | Жиі қойылатын сұрақтар |
| 📞 Байланыс | `/contact` | Байланыс формасы |
| 👑 Админ | `/admin` | Дашборд, пәтерлер, пікірлер, аккаунттар |

### Негізгі мүмкіндіктер

- ✅ **18 388 нақты пәтер** деректері (krisha.kz)
- ✅ **Аудан бойынша топтастыру** — 6 аудан
- ✅ **Фильтрация** — аудан, бөлме саны, баға шегі
- ✅ **Пәтер салыстыру** — 3 пәтерді side-by-side
- ✅ **Тарих** — соңғы 20 қаралған пәтер
- ✅ **Таңдаулылар** — localStorage + DB синхрон
- ✅ **Toast хабарландырулар** — барлық әрекеттерде
- ✅ **ЖИ кеңесші** — нақты пәтер карточкаларымен
- ✅ **Интерактивті карта** — маршрут (жаяу/көлік)
- ✅ **Статистика** — 6 диаграмма түрі

---

## 🗄️ Деректер базасы (PostgreSQL)

### Кестелер

```sql
users       — пайдаланушылар (id, email, password_hash, role)
apartments  — пәтерлер (18 388 жазба)
favorites   — таңдаулылар (user_id, apartment_id)
feedback    — пікірлер (user_id, rating, comment)
```

### API Endpoints

```
POST   /api/auth/signin          — кіру
POST   /api/auth/signup          — тіркелу
GET    /api/apartments           — пәтерлер тізімі (фильтрмен)
GET    /api/apartments/:id       — жеке пәтер
GET    /api/statistics           — нарық статистикасы
GET    /api/favorites            — таңдаулылар
POST   /api/favorites            — таңдаулыға қосу
DELETE /api/favorites            — таңдаулыдан алу
GET    /api/feedback             — пікірлер
POST   /api/feedback             — пікір қосу
GET    /api/metrics              — Prometheus метрикалары
```

### Деректер жүктеу

```bash
# apartments.json → PostgreSQL (18 388 жазба)
node database/generate-seed.cjs
docker exec -e PGPASSWORD=postgres123 astana_db psql -U postgres -d astana_housing -f /tmp/seed-full.sql
```

---

## 🐳 Контейнерлеу (Docker)

### 11 сервис

```yaml
postgres        — PostgreSQL 16 (port 5432)
backend         — Express API (port 3001)
frontend        — React + Nginx (port 80)
nginx           — Reverse Proxy SSL (port 443)
prometheus      — Метрика жинау (port 9090)
grafana         — Визуализация (port 3000)
alertmanager    — Алерт басқару (port 9093)
node-exporter   — Сервер метрикалары (port 9100)
telegram-bot    — Алерт хабарламалары
jenkins         — CI/CD (port 8080)
n8n             — AI workflow (port 5678)
```

```bash
# Барлық сервистерді іске қосу
docker-compose up -d

# Статус тексеру
docker-compose ps

# Логтар
docker-compose logs -f backend
```

---

## 🔒 Қауіпсіздік және Желі

```
Клиент → Nginx (443/SSL) → Frontend (80) → Backend (3001) → PostgreSQL (5432)
```

| Компонент | Сипаттама |
|---|---|
| **SSL/TLS** | Self-signed сертификат (`nginx/ssl/`) |
| **Nginx** | HTTP→HTTPS redirect, reverse proxy |
| **Пароль** | bcrypt хэш (PostgreSQL) |
| **Admin** | Hardcode + DB тексеру |
| **Backup** | Ansible автоматты PostgreSQL dump |

---

## 📊 Мониторинг

### Prometheus + Grafana

- CPU, RAM, Диск метрикалары
- Backend HTTP сұраулары (latency, count)
- Grafana Dashboard: http://localhost:3000

### Telegram Алерттер

| Алерт | Шарт |
|---|---|
| `BackendDown` | Backend 1 минут өшсе |
| `HighCPUUsage` | CPU > 80% |
| `LowMemory` | RAM < 20% |
| `LowDiskSpace` | Диск < 15% |

---

## 🔄 CI/CD (Jenkins)

```groovy
// Jenkinsfile pipeline кезеңдері:
1. Checkout    — GitHub-тан код алу
2. Install     — npm install
3. Build       — TypeScript компиляция
4. Test        — тесттер (болашақта)
5. Deploy      — Docker rebuild + restart
6. Notify      — Telegram хабарлама
```

---

## 🤖 Жасанды Интеллект

### Баспана ЖИ (ChatPage)

- **Модель:** `llama-3.3-70b-versatile` (Groq API)
- **Мүмкіндіктер:**
  - Аудан + бөлме бойынша нақты пәтер карточкалары
  - Баға талдауы (тек ₸)
  - Ипотека есебі
  - Инвестиция кеңесі
- **Fallback:** n8n → Groq тікелей

### n8n Workflow

```
Webhook (POST /webhook/astana-chat)
  → Groq AI (llama-3.3-70b-versatile)
  → Telegram логтау
  → Response (JSON)
```

---

## 🏗️ IaC (Terraform + Ansible)

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

## 📁 Жоба құрылымы

```
astana-housing/
├── src/                          # React Frontend
│   ├── components/               # Қайта қолданылатын компоненттер
│   │   ├── ApartmentCard.tsx     # Пәтер карточкасы
│   │   ├── Navbar.tsx            # Төменгі навигация
│   │   ├── TopBar.tsx            # Жоғарғы бар + логотип
│   │   ├── Toast.tsx             # Хабарландыру жүйесі
│   │   └── MapModal.tsx          # Карта модалы
│   ├── pages/                    # Беттер (13 бет)
│   │   ├── HomePage.tsx          # Басты бет
│   │   ├── ApartmentsPage.tsx    # Пәтерлер тізімі
│   │   ├── ApartmentDetailPage.tsx # Пәтер мәліметі
│   │   ├── SearchPage.tsx        # Іздеу
│   │   ├── MapPage.tsx           # Карта
│   │   ├── StatisticsPage.tsx    # Статистика
│   │   ├── ChatPage.tsx          # ЖИ Чат
│   │   ├── ComparePage.tsx       # Пәтер салыстыру
│   │   ├── HistoryPage.tsx       # Тарих
│   │   ├── ProfilePage.tsx       # Профиль
│   │   ├── AdminPage.tsx         # Админ панелі
│   │   ├── NotificationsPage.tsx # Хабарландырулар
│   │   ├── FAQPage.tsx           # FAQ
│   │   ├── ContactPage.tsx       # Байланыс
│   │   └── WelcomePage.tsx       # Кіру беті
│   ├── hooks/                    # React хуктары
│   ├── types/                    # TypeScript типтері
│   └── utils/                    # Утилиталар
├── server/                       # Express Backend
│   └── src/
│       ├── index.ts              # Сервер кіру нүктесі
│       ├── db.ts                 # PostgreSQL байланысы
│       └── routes/               # API маршруттары
├── database/                     # PostgreSQL
│   ├── schema.sql                # Кесте схемасы
│   ├── seed.sql                  # Бастапқы деректер
│   └── generate-seed.cjs        # JSON → SQL генератор
├── nginx/                        # Nginx конфигурация
│   ├── nginx.conf                # Негізгі конфиг
│   ├── frontend.conf             # Frontend proxy
│   └── ssl/                      # SSL сертификаттар
├── monitoring/                   # Мониторинг
│   ├── prometheus.yml            # Prometheus конфиг
│   ├── alerts.yml                # Алерт ережелері
│   ├── alertmanager.yml          # Алерт менеджер
│   ├── grafana/                  # Grafana дашборд
│   └── telegram-bot/             # Telegram алерт боты
├── terraform/                    # IaC
│   ├── main.tf                   # Негізгі конфигурация
│   ├── variables.tf              # Айнымалылар
│   └── outputs.tf                # Шығыс мәндер
├── ansible/                      # Автоматтандыру
│   ├── playbook.yml              # Орнату
│   ├── backup.yml                # Backup
│   ├── monitoring.yml            # Мониторинг тексеру
│   └── inventory.ini             # Хост тізімі
├── n8n/                          # AI Workflow
│   └── workflow.json             # n8n workflow конфиг
├── public/                       # Статикалық файлдар
│   ├── apartments.json           # 18 388 пәтер деректері
│   └── statistics.json           # Статистика деректері
├── docker-compose.yml            # 11 сервис конфигурациясы
├── Dockerfile.frontend           # Frontend Docker образы
├── Dockerfile.backend            # Backend Docker образы
├── Jenkinsfile                   # CI/CD Pipeline
├── setup.ps1                     # Windows іске қосу скрипті
└── setup.sh                      # Linux іске қосу скрипті
```

---

## 📈 Статистика

| Көрсеткіш | Мән |
|---|---|
| Пәтерлер саны | 18 388 |
| Орташа баға | 44 млн ₸ |
| Аудандар | 6 |
| Frontend беттер | 15 |
| API endpoints | 10+ |
| Docker сервистер | 11 |
| Код жолдары | 10 000+ |

---

<div align="center">

**Астана Баспана** — Сенің сенімді мекенің 🏠

*React · TypeScript · Node.js · PostgreSQL · Docker · Prometheus · Grafana · Jenkins · Terraform · Ansible · Groq AI*

</div>
