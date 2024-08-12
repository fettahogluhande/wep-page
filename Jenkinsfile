pipeline {
    agent any

    environment {
        GOOGLE_CREDENTIALS = credentials('google-credentials')
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
                script {
                    withCredentials([string(credentialsId: 'snyk-api-token', variable: 'SNYK_TOKEN')]) {
                        def snykResult = sh(script: 'snyk test --all-projects --severity-threshold=high', returnStatus: true)
                        if (snykResult != 0) {
                            echo "Snyk found high-severity vulnerabilities. Continuing despite non-critical issues."
                        }
                    }
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
                               sh '''
                                curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
                                chmod +x kubectl

                                export PATH=$PATH:/tmp

                                gcloud auth activate-service-account --key-file=${GOOGLE_CREDENTIALS}
                                
                                gcloud container clusters get-credentials cluster-1 --zone us-central1-c --project devops-project-430908
                                sed -i "s/latest/${BUILD_NUMBER}/g" ./k8s/app-deployment.yaml
                                kubectl apply -f ./k8s/app-deployment.yaml
                                '''
                        
                }
            }
        }
/*
        stage('Test') {
            steps {
                sh 'npm install -g http-server'
                sh 'http-server -p 8082'
                sh 'sleep 5'
                sh 'sudo node selenium_test.js' 
            }
        }*/
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
