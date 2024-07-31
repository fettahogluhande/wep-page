pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                // GitHub'dan projeyi klonluyoruz
                git 'https://github.com/fettahogluhande/wep-page.git'
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
                sh 'http-server . -p 8080 &'
            }
        }
        
        stage('Test') {
            steps {
                // Sunucunun çalıştığını kontrol ediyoruz
                sh 'curl -I http://localhost:8080/index.html'
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
