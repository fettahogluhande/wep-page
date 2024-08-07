pipeline {
    agent any

    environment {
        PROJECT_ID = 'devops-project-430908'
        CLUSTER_NAME = 'cluster-1'
        ZONE = 'us-central1-c'
        KUBECONFIG = credentials('kubeconfig')
        GOOGLE_CREDENTIALS = credentials('jenkins-key')
    }

    tools {
        nodejs "nodejs"
        dockerTool "Docker"
        snyk "Snyk"
    }

    // SCM'den kodu çek
    stages {
        stage('SCM Checkout') {
            steps {
                checkout scm
            }
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
                        dockerImage = docker.build("fettahogluhande/wep-page:${BUILD_ID}")
                    }
                }
            }
        }

       

      stage('Image Scan and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-credentials') {
                            sh "docker push fettahogluhande/wep-page:${BUILD_ID}"
                        }
                    }
                    withCredentials([string(credentialsId: 'snyk-api-token', variable: 'SNYK_TOKEN')]) {
                        def snykResult = sh(script: "snyk test --docker fettahogluhande/wep-page:${BUILD_ID} --severity-threshold=high", returnStatus: true)
                        if (snykResult != 0) {
                            echo "Snyk found vulnerabilities. Continuing despite non-critical issues."
                        }
                    }
                }
            }
        }

        stage('Deploy to Test Cluster') {
            steps {
                script {
                    // Kubernetes yapılandırmalarını uygula
                    // sh 'kubectl apply -f ./k8s/deployment.yaml'

                       // Kubectl'yi indir
                        sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
           

                        // Kubeconfig dosyasını Jenkins'den alın
                        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]){
                               sh '''
                               
                                gcloud auth activate-service-account --key-file=${GOOGLE_CREDENTIALS}
                             
                                
                    
                                kubectl apply -f k8s/deployment.yaml
                                kubectl apply -f k8s/service.yaml
                                '''
                            
                        }

                        // Kubernetes kümesi kimlik bilgilerini al
                        //sh 'gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project devops-project-430908'
   //gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID
            
                        // Deployment dosyalarını güncelle ve uygula
                        //sh 'sed -i "s/latest/${BUILD_NUMBER}/g" ./k8s/app-deployment.yaml'
                        //sh 'kubectl apply -f ./k8s/app-deployment.yaml'


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
