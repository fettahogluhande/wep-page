pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/fettahogluhande/wep-page', branch: 'main'
            }
        }

      stage('Code Scan') {
            steps {
                snykSecurity organisation: 'fettahogluhande' , projectName: 'wep-page' , severity: 'medium', snykInstallation: 'Snyk', snykTokenId: 'snyk-api-token'
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

        stage('Deploy to test cluster') {
            steps {
                script {
                        sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" '
                       
                        withCredentials([file(credentialsId: 'gcloud-service-account-key', variable: 'GCLOUD_KEY')]) {
                        sh "gcloud auth activate-service-account --key-file=${GCLOUD_KEY}"
                        }

                        sh 'gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project devops-project-430908'
                        sh 'sed -i "s/latest/${BUILD_ID}/g" ./k8s/deployment.yaml'
                        sh 'kubectl apply -f ./k8s/deployment.yaml'
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
