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

        stage('Build Docker Image') { 
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        dockerImage = docker.build("fettahogluhande/wep-page:latest")
                    }
                }
            }
        }

        // stage('Push Docker Image') {
        //     steps {
        //         script {
        //             withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
        //                 docker.withRegistry('https://registry.hub.docker.com/', 'docker-credentials') {
        //                     dockerImage.push("fettahogluhande/wep-page:latest")
        //                 }
        //             }
        //         }
        //     }
        // }

      stage('Image Scan and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-credentials') {
                            sh 'docker push fettahogluhande/wep-page:latest'
                        }
                    }
                    withCredentials([string(credentialsId: 'snyk-api-token', variable: 'SNYK_TOKEN')]) {
                        sh 'snyk test --docker fettahogluhande/wep-page:latest'
                    }
                }
            }
        }

        stage('Deploy to Test Cluster') {
            steps {
                script {
                    // Kubernetes yapılandırmalarını uygula
                    sh 'kubectl apply -f ./k8s/deployment.yaml'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    dockerImage.inside('-p 8082:80') {
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
