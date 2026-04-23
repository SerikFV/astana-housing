pipeline {
    agent any

    environment {
        APP_NAME = 'astana-housing'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Код тартылуда...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Docker image build болуда...'
                sh 'docker-compose build backend frontend'
            }
        }

        stage('Test') {
            steps {
                echo 'Backend health тексерілуде...'
                sh 'docker-compose up -d backend postgres'
                sh 'sleep 10'
                sh 'curl -f http://localhost:3001/api/health || exit 1'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Деплой жасалуда...'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Pipeline сәтті аяқталды!'
        }
        failure {
            echo 'Pipeline қатемен аяқталды!'
        }
    }
}
