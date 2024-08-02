pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/fettahogluhande/wep-page', branch: 'main'
            }
        }

        stage('Build Docker Image') { // Docker image'inizi oluşturmak için bir aşama ekledim
            steps {
                script {
                    dockerImage = docker.build("fettahogluhande/wep-page:${env.BUILD_ID}")
                }
            }
        }

        stage('Push Docker Image') { // Docker image'inizi Docker Hub'a göndermek için bir aşama ekledim
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                            dockerImage.push("${env.BUILD_ID}")
                        }
                    }
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    dockerImage.inside('-p 8080:80') {
                        // HTTP sunucusunun çalışıp çalışmadığını test etmek için
                        sh 'sleep 5'
                        sh 'curl -I http://34.136.71.21:8080/index.html'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline tamamlandı.'
        }
        success {
            echo 'Pipeline başarıyla tamamlandı.'
        }
        failure {
            echo 'Pipeline başarısız oldu.'
        }
    }
}
