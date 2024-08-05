pipeline {
    agent any

    tools {
        nodejs "nodejs"
        dockerTool "Docker"
        snyk "Snyk"
    }

    stages {

        stage('SCM Checkout') {
            steps {
                checkout scm
            }
            // SCM'den kodu çek
        }

        stage('Install Snyk') {
            steps {
        sh 'npm install -g snyk'
            }
        }

        stage('Code Scan') {
            steps {
                withCredentials([string(credentialsId: 'snyk-api-token', variable: 'SNYK_TOKEN')]) {
                    sh 'snyk test --all-projects'
                }
            }
        }

         stage('Install HTTP Server') {
            steps {
                // Basit bir HTTP sunucusu kurmak için 'http-server' modülünü yüklüyoruz
                sh 'npm install -g http-server'
            }
        }
        
        stage('Start HTTP Server') {
            steps {
                // HTTP sunucusunu başlatıyoruz
                sh 'nohup http-server . -p 8080 &'
            }
        }
        
        stage('Test') {
            steps {
                // Sunucunun çalıştığını kontrol ediyoruz
                sh 'sleep 5' // Sunucunun başlatılması için kısa bir bekleme süresi ekleyin
                sh 'curl -I http://34.136.71.21:8080/index.html'
            }
        }
    }

    post {
        always {
            // Temizlik işlemleri veya bildirimler
            echo 'Pipeline tamamlandı.'
        }
    }
}

