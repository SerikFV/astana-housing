# Terraform — Astana Housing Infrastructure

## Не жасайды
Docker provider арқылы барлық контейнерлерді код ретінде сипаттайды:
- PostgreSQL 16
- Prometheus
- Grafana
- Node Exporter

## Іске қосу
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Өшіру
```bash
terraform destroy
```

## Variables
| Айнымалы | Мән | Сипаттама |
|---|---|---|
| db_name | astana_housing | БД аты |
| db_password | postgres123 | БД пароль |
| grafana_password | admin123 | Grafana пароль |
