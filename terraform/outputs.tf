# ============================================================
# Astana Housing — Terraform Outputs
# ============================================================

output "postgres_container_id" {
  description = "PostgreSQL контейнер ID"
  value       = docker_container.postgres.id
}

output "postgres_connection" {
  description = "PostgreSQL қосылу жолы"
  value       = "postgresql://${var.db_user}:***@localhost:${var.db_port}/${var.db_name}"
}

output "grafana_url" {
  description = "Grafana URL"
  value       = "http://localhost:3000"
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://localhost:9090"
}

output "network_name" {
  description = "Docker network аты"
  value       = docker_network.app_network.name
}
