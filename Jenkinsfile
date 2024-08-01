pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Projeyi GitHub'dan çek
                 git url: 'https://github.com/fettahogluhande/wep-page', branch: 'main'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // HTTP sunucusu için gerekli bağımlılıkları yükle
                    sh 'npm install -g http-server'
                }
            }
        }

        stage('Serve HTML') {
            steps {
                script {
                    // HTTP sunucusunu başlat
                    sh 'http-server -p 8080 &'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Basit bir test komutu, bu aşamada daha detaylı testler ekleyebilirsiniz
                    sh 'curl -I http://localhost:8080'
                }
            }
        }
    }

    post {
        always {
            // Jenkins işini bitirdikten sonra HTTP sunucusunu durdur
            sh 'pkill http-server || true'
        }
    }
}
