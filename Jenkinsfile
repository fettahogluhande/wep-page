pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/fettahogluhande/wep-page', branch: 'main'
            }
        }

        stage('Pull Docker Image') {
            steps {
                script {
                    dockerImage = docker.image('fettahogluhande/wep-page:latest') // Docker Hub'daki image bilgilerinizi buraya ekleyin
                    dockerImage.pull()
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    dockerImage.inside('-p 8080:80') {
                        // HTTP sunucusunun çalışıp çalışmadığını test etmek için
                        sh 'sleep 5'
                        sh 'curl -I http://localhost:8080/index.html'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline tamamlandı.'
        }
    }
}
