# ============================================================
# Astana Housing — Terraform Variables
# ============================================================

variable "db_name" {
  description = "PostgreSQL дерекқор аты"
  type        = string
  default     = "astana_housing"
}

variable "db_user" {
  description = "PostgreSQL пайдаланушы аты"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL құпиясөзі"
  type        = string
  default     = "postgres123"
  sensitive   = true
}

variable "db_port" {
  description = "PostgreSQL сыртқы порты"
  type        = number
  default     = 5432
}

variable "grafana_user" {
  description = "Grafana admin пайдаланушы аты"
  type        = string
  default     = "admin"
}

variable "grafana_password" {
  description = "Grafana admin құпиясөзі"
  type        = string
  default     = "admin123"
  sensitive   = true
}

variable "app_env" {
  description = "Орта (development/production)"
  type        = string
  default     = "development"
}
