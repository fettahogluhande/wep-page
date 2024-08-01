pipeline {
    agent {
        docker {
            image 'fettahogluhande/wep-page'
            args '-u root:root'
        }
    }

    stages {
        stage('Clone Repository') {
            steps {
                // GitHub'dan projeyi klonluyoruz
                git url: 'https://github.com/fettahogluhande/wep-page', branch: 'main'
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
