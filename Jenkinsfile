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
        BACKEND_URL      = 'http://host.docker.internal:3001'
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
                bat 'docker --version'
                bat 'docker-compose --version'
            }
        }

        stage('Build') {
            steps {
                echo 'Docker image build болуда...'
                bat 'docker-compose build telegram-bot'
            }
        }

        stage('Test') {
            steps {
                echo 'Сервистер тексерілуде...'
                script {
                    def dbStatus = bat(
                        script: 'docker exec astana_db pg_isready -U postgres',
                        returnStatus: true
                    )
                    echo "PostgreSQL: ${dbStatus == 0 ? 'OK' : 'FAIL'}"

                    def prometheusStatus = bat(
                        script: 'curl -sf http://localhost:9090/-/healthy',
                        returnStatus: true
                    )
                    echo "Prometheus: ${prometheusStatus == 0 ? 'OK' : 'FAIL'}"

                    def grafanaStatus = bat(
                        script: 'curl -sf http://localhost:3000/api/health',
                        returnStatus: true
                    )
                    echo "Grafana: ${grafanaStatus == 0 ? 'OK' : 'FAIL'}"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy жасалуда...'
                bat 'docker-compose up -d --remove-orphans'
                echo 'Deploy аяқталды!'
            }
        }
    }

    post {
        success {
            echo 'Pipeline сатти ayaqtaldy!'
            bat """
                curl -s -X POST "https://api.telegram.org/bot%TELEGRAM_TOKEN%/sendMessage" -d "chat_id=%TELEGRAM_CHAT_ID%&text=BUILD SUCCESS: %APP_NAME% Build %BUILD_NUMBER%"
            """
        }
        failure {
            echo 'Pipeline qatemен ayaqtaldy!'
            bat """
                curl -s -X POST "https://api.telegram.org/bot%TELEGRAM_TOKEN%/sendMessage" -d "chat_id=%TELEGRAM_CHAT_ID%&text=BUILD FAILED: %APP_NAME% Build %BUILD_NUMBER%"
            """
        }
    }
}
