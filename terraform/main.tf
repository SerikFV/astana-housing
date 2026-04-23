# ============================================================
# Astana Housing — Terraform Infrastructure
# Docker provider арқылы локальды инфрақұрылым
# ============================================================

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.0"
}

provider "docker" {
  host = "npipe:////.//pipe//docker_engine"
}

# ============================================================
# Network
# ============================================================
resource "docker_network" "app_network" {
  name   = "astana_tf_network"
  driver = "bridge"
}

# ============================================================
# PostgreSQL Volume
# ============================================================
resource "docker_volume" "postgres_data" {
  name = "astana_tf_pgdata"
}

# ============================================================
# PostgreSQL Container
# ============================================================
resource "docker_container" "postgres" {
  name  = "astana_tf_db"
  image = docker_image.postgres.image_id

  restart = "unless-stopped"

  env = [
    "POSTGRES_DB=${var.db_name}",
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
  ]

  ports {
    internal = 5432
    external = var.db_port
  }

  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }

  healthcheck {
    test         = ["CMD-SHELL", "pg_isready -U ${var.db_user}"]
    interval     = "10s"
    timeout      = "5s"
    retries      = 5
    start_period = "10s"
  }
}

# ============================================================
# Docker Images
# ============================================================
resource "docker_image" "postgres" {
  name = "postgres:16-alpine"
}

resource "docker_image" "prometheus" {
  name = "prom/prometheus:latest"
}

resource "docker_image" "grafana" {
  name = "grafana/grafana:latest"
}

resource "docker_image" "node_exporter" {
  name = "prom/node-exporter:latest"
}

# ============================================================
# Prometheus Volume
# ============================================================
resource "docker_volume" "prometheus_data" {
  name = "astana_tf_prometheus"
}

# ============================================================
# Prometheus Container
# ============================================================
resource "docker_container" "prometheus" {
  name  = "astana_tf_prometheus"
  image = docker_image.prometheus.image_id

  restart = "unless-stopped"

  command = [
    "--config.file=/etc/prometheus/prometheus.yml",
    "--storage.tsdb.path=/prometheus",
    "--web.enable-lifecycle",
    "--storage.tsdb.retention.time=7d",
  ]

  ports {
    internal = 9090
    external = 9090
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/prometheus.yml")
    container_path = "/etc/prometheus/prometheus.yml"
    read_only      = true
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/alerts.yml")
    container_path = "/etc/prometheus/alerts.yml"
    read_only      = true
  }

  volumes {
    volume_name    = docker_volume.prometheus_data.name
    container_path = "/prometheus"
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# ============================================================
# Grafana Volume
# ============================================================
resource "docker_volume" "grafana_data" {
  name = "astana_tf_grafana"
}

# ============================================================
# Grafana Container
# ============================================================
resource "docker_container" "grafana" {
  name  = "astana_tf_grafana"
  image = docker_image.grafana.image_id

  restart = "unless-stopped"

  env = [
    "GF_SECURITY_ADMIN_USER=${var.grafana_user}",
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_password}",
    "GF_USERS_ALLOW_SIGN_UP=false",
    "GF_SERVER_ROOT_URL=http://localhost:3000",
  ]

  ports {
    internal = 3000
    external = 3000
  }

  volumes {
    volume_name    = docker_volume.grafana_data.name
    container_path = "/var/lib/grafana"
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/grafana/datasources.yml")
    container_path = "/etc/grafana/provisioning/datasources/datasources.yml"
    read_only      = true
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}

# ============================================================
# Node Exporter
# ============================================================
resource "docker_container" "node_exporter" {
  name  = "astana_tf_node_exporter"
  image = docker_image.node_exporter.image_id

  restart = "unless-stopped"

  ports {
    internal = 9100
    external = 9100
  }

  networks_advanced {
    name = docker_network.app_network.name
  }
}
