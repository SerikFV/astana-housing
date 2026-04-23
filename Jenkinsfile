// ============================================================
// Astana Housing — Jenkins CI/CD Pipeline
// GitHub-пен толық интеграция
// ============================================================

pipeline {
    agent any

    environment {
        APP_NAME     = 'astana-housing'
        GITHUB_REPO  = 'https://github.com/SerikFV/astana-housing.git'
        DOCKER_COMPOSE = 'docker-compose'
        TELEGRAM_TOKEN   = '8783899500:AAHaZ_05HRKGKfWtG4UpEL82AkCz2UvoXLs'
        TELEGRAM_CHAT_ID = '1609875869'
        BACKEND_URL  = 'http://localhost:3001'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    triggers {
        // GitHub webhook арқылы автоматты іске қосу
        githubPush()
    }

    stages {

        // ============================================================
        // 1. Код тарту
        // ============================================================
        stage('Checkout') {
            steps {
                echo '📥 GitHub-тан код тартылуда...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: env.GITHUB_REPO
                    ]]
                ])
                echo "✅ Commit: ${env.GIT_COMMIT?.take(7) ?: 'N/A'}"
            }
        }

        // ============================================================
        // 2. Ортаны тексеру
        // ============================================================
        stage('Environment Check') {
            steps {
                echo '🔍 Орта тексерілуде...'
                script {
                    def dockerVersion = sh(script: 'docker --version', returnStdout: true).trim()
                    echo "Docker: ${dockerVersion}"

                    def composeVersion = sh(script: 'docker-compose --version', returnStdout: true).trim()
                    echo "Docker Compose: ${composeVersion}"
                }
            }
        }

        // ============================================================
        // 3. Docker build
        // ============================================================
        stage('Build') {
            steps {
                echo '🔨 Docker image build болуда...'
                script {
                    sh "${DOCKER_COMPOSE} build --no-cache telegram-bot"
                    echo '✅ Build аяқталды'
                }
            }
        }

        // ============================================================
        // 4. Тест
        // ============================================================
        stage('Test') {
            steps {
                echo '🧪 Тесттер жүргізілуде...'
                script {
                    // PostgreSQL тексеру
                    def dbStatus = sh(
                        script: 'docker exec astana_db pg_isready -U postgres 2>&1 || echo "DB_DOWN"',
                        returnStdout: true
                    ).trim()
                    echo "PostgreSQL: ${dbStatus}"

                    // Backend health check
                    def backendStatus = sh(
                        script: "curl -sf ${BACKEND_URL}/api/health 2>&1 || echo 'BACKEND_DOWN'",
                        returnStdout: true
                    ).trim()
                    echo "Backend: ${backendStatus}"

                    // Prometheus тексеру
                    def prometheusStatus = sh(
                        script: 'curl -sf http://localhost:9090/-/healthy 2>&1 || echo "PROMETHEUS_DOWN"',
                        returnStdout: true
                    ).trim()
                    echo "Prometheus: ${prometheusStatus}"
                }
            }
        }

        // ============================================================
        // 5. Деплой
        // ============================================================
        stage('Deploy') {
            steps {
                echo '🚀 Деплой жасалуда...'
                script {
                    sh "${DOCKER_COMPOSE} up -d --remove-orphans"
                    echo '✅ Деплой аяқталды'
                }
            }
        }

        // ============================================================
        // 6. Smoke Test
        // ============================================================
        stage('Smoke Test') {
            steps {
                echo '💨 Smoke тест жүргізілуде...'
                script {
                    sleep(time: 5, unit: 'SECONDS')

                    def services = [
                        [name: 'PostgreSQL', cmd: 'docker exec astana_db pg_isready -U postgres'],
                        [name: 'Prometheus', cmd: 'curl -sf http://localhost:9090/-/healthy'],
                        [name: 'Grafana',    cmd: 'curl -sf http://localhost:3000/api/health'],
                    ]

                    services.each { svc ->
                        def result = sh(script: "${svc.cmd} 2>&1", returnStatus: true)
                        echo "${svc.name}: ${result == 0 ? '✅ OK' : '❌ FAIL'}"
                    }
                }
            }
        }
    }

    // ============================================================
    // Post actions — Telegram хабарлама
    // ============================================================
    post {
        success {
            echo '✅ Pipeline сәтті аяқталды!'
            script {
                def msg = "✅ BUILD SUCCESS%0A" +
                          "Жоба: ${env.APP_NAME}%0A" +
                          "Branch: ${env.GIT_BRANCH ?: 'main'}%0A" +
                          "Commit: ${env.GIT_COMMIT?.take(7) ?: 'N/A'}%0A" +
                          "Build: #${env.BUILD_NUMBER}"
                sh """
                    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
                    -d "chat_id=${TELEGRAM_CHAT_ID}&text=${msg}" > /dev/null
                """
            }
        }
        failure {
            echo '❌ Pipeline қатемен аяқталды!'
            script {
                def msg = "❌ BUILD FAILED%0A" +
                          "Жоба: ${env.APP_NAME}%0A" +
                          "Branch: ${env.GIT_BRANCH ?: 'main'}%0A" +
                          "Build: #${env.BUILD_NUMBER}%0A" +
                          "Логтар: ${env.BUILD_URL}"
                sh """
                    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
                    -d "chat_id=${TELEGRAM_CHAT_ID}&text=${msg}" > /dev/null
                """
            }
        }
        always {
            echo "Build #${env.BUILD_NUMBER} аяқталды"
        }
    }
}
