pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Clone Repository') {
add             steps {
                git url: 'https://github.com/fettahogluhande/wep-page', branch: 'main'
            }
        }
        
        stage('Install HTTP Server') {
            steps {
                sh 'npm install -g http-server'
            }
        }
        
        stage('Start HTTP Server') {
            steps {
                sh 'nohup http-server . -p 8080 &'
            }
        }
        
        stage('Test') {
            steps {
                sh 'sleep 5'
                sh 'curl -I http://localhost:8080/index.html'
            }
        }
    }

    post {
        always {
            echo 'Pipeline tamamlandı.'
        }
    }
}
