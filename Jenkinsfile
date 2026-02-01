pipeline {
    agent any
    
    environment {
        IMAGE_NAME = "devagauri/travelsmart"
        IMAGE_TAG = "latest"
    }
    
    stages {
        stage('Start Pipeline') {
            steps {
                echo "Starting TravelSmart CI/CD Pipeline 🚀"
            }
        }
        
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/devashri26/TravelSmart_Project.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building TravelSmart Docker image..."
                    def customImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                    def buildNumberImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}")
                    env.IMAGE_ID = customImage.id
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                        docker.image("${IMAGE_NAME}:${BUILD_NUMBER}").push()
                    }
                }
            }
        }
    }
    
    post {
        success { 
            echo "TravelSmart Docker image successfully built and pushed 🚀" 
            echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
            echo "Build: ${IMAGE_NAME}:${BUILD_NUMBER}"
        }
        failure { 
            echo "TravelSmart pipeline failed ❌" 
        }
    }
}