pipeline {
    agent any

    tools {
        nodejs "NodeJS"
        dockerTool "Docker"
    }

    stages {

        stage('SCM Checkout') {
            steps {
                checkout scm
            }
            // SCM'den kodu çek
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
                    dockerImage = docker.build("fettahogluhande/wep-page:${env.BUILD_ID}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        docker.withRegistry('https://registry.hub.docker.com/', 'docker-hub-credentials') {
                            dockerImage.push("${env.BUILD_ID}")
                            dockerImage.push("latest")
                        }
                    }
                }
            }
        }

        stage('Deploy to Test Cluster') {
            steps {
                script {
                    // kubectl'yi indir ve çalıştırılabilir hale getir
                    sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
                    // sh 'chmod +x kubectl'
                    // sh 'sudo mv kubectl /usr/local/bin/'

                    // Google Cloud kimlik doğrulamasını yap
                    withCredentials([file(credentialsId: 'gcloud-service-account-key', variable: 'GCLOUD_KEY')]) {
                        sh "gcloud auth activate-service-account --key-file=${GCLOUD_KEY}"
                    }

                    // GKE kümesine bağlan
                    sh 'gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project devops-project-430908'

                    // Docker image tag'lerini güncelle
                    sh 'sed -i "s/latest/${env.BUILD_ID}/g" ./k8s/deployment.yaml'

                    // Kubernetes yapılandırmalarını uygula
                    sh 'kubectl apply -f ./k8s/deployment.yaml'
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
