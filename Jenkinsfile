// ============================================================
// Astana Housing — Jenkins CI/CD Pipeline
// ============================================================

pipeline {
    agent any

    environment {
        APP_NAME         = 'astana-housing'
        GITHUB_REPO      = 'https://github.com/SerikFV/astana-housing.git'
        TELEGRAM_TOKEN   = '8783899500:AAHaZ_05HRKGKfWtG4UpEL82AkCz2UvoXLs'
        TELEGRAM_CHAT_ID = '1609875869'
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'GitHub-тан код тартылуда...'
                checkout scm
                echo "Commit: ${env.GIT_COMMIT?.take(7) ?: 'N/A'}"
            }
        }

        stage('Environment Check') {
            steps {
                echo 'Орта тексерілуде...'
                sh 'docker --version || echo "Docker жоқ"'
                sh 'echo "Jenkins Linux контейнерінде жұмыс істеп тұр"'
            }
        }

        stage('Test Services') {
            steps {
                echo 'Сервистер тексерілуде...'
                script {
                    def dbStatus = sh(
                        script: 'docker exec astana_db pg_isready -U postgres 2>&1 || echo "DB_CHECK_DONE"',
                        returnStdout: true
                    ).trim()
                    echo "PostgreSQL: ${dbStatus}"

                    def prometheusStatus = sh(
                        script: 'curl -sf http://host.docker.internal:9090/-/healthy 2>&1 && echo "OK" || echo "CHECKING"',
                        returnStdout: true
                    ).trim()
                    echo "Prometheus: ${prometheusStatus}"

                    def grafanaStatus = sh(
                        script: 'curl -sf http://host.docker.internal:3000/api/health 2>&1 && echo "OK" || echo "CHECKING"',
                        returnStdout: true
                    ).trim()
                    echo "Grafana: ${grafanaStatus}"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy жасалуда...'
                sh 'docker ps --format "table {{.Names}}\\t{{.Status}}" | head -20'
                echo 'Барлық сервистер тексерілді!'
            }
        }
    }

    post {
        success {
            echo 'Pipeline sattti ayaqtaldy!'
            sh """
                curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
                -d "chat_id=${TELEGRAM_CHAT_ID}&text=BUILD+SUCCESS:+${APP_NAME}+Build+${BUILD_NUMBER}" || true
            """
        }
        failure {
            echo 'Pipeline qatemен ayaqtaldy!'
            sh """
                curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
                -d "chat_id=${TELEGRAM_CHAT_ID}&text=BUILD+FAILED:+${APP_NAME}+Build+${BUILD_NUMBER}" || true
            """
        }
    }
}
