# Ansible — Astana Housing Automation

## Playbook-тар

### 1. Толық орнату
```bash
ansible-playbook -i inventory.ini playbook.yml
```
- Docker тексеру
- SSL сертификат жасау
- Docker Compose іске қосу
- npm install
- Health check

### 2. Backup жасау
```bash
ansible-playbook -i inventory.ini backup.yml
```
- PostgreSQL dump → `backups/backup_TIMESTAMP.sql`
- 7 күннен ескі backup-тарды автоматты өшіру

### 3. Monitoring тексеру
```bash
ansible-playbook -i inventory.ini monitoring.yml
```
- Prometheus/Grafana статусы
- Конфигурацияны қайта жүктеу
