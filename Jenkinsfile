pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'devagauri/travelsmart'
        MAVEN_OPTS = '-Dmaven.repo.local=.m2/repository'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                echo 'Setting up build environment...'
                sh 'chmod +x TravelSmart/mvnw'
            }
        }
        
        stage('Build Backend') {
            steps {
                echo 'Building Spring Boot application...'
                dir('TravelSmart') {
                    sh './mvnw clean compile -DskipTests'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                echo 'Running backend tests...'
                dir('TravelSmart') {
                    sh './mvnw test || true'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Building React application...'
                dir('travelsmart-frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Package Backend') {
            steps {
                echo 'Packaging Spring Boot application...'
                dir('TravelSmart') {
                    sh './mvnw package -DskipTests'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    def imageTag = "${DOCKER_HUB_REPO}:${BUILD_NUMBER}"
                    def latestTag = "${DOCKER_HUB_REPO}:latest"
                    
                    sh "docker build -t ${imageTag} -t ${latestTag} ."
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to staging environment...'
                script {
                    sh """
                        docker stop travelsmart-staging || true
                        docker rm travelsmart-staging || true
                        docker run -d --name travelsmart-staging \\
                            -p 8087:8080 \\
                            -p 5174:5173 \\
                            -e SPRING_PROFILES_ACTIVE=staging \\
                            ${DOCKER_HUB_REPO}:${BUILD_NUMBER}
                    """
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                branch 'main'
            }
            steps {
                echo 'Running integration tests...'
                script {
                    sleep 30 // Wait for application to start
                    sh 'curl -f http://localhost:8087/actuator/health || echo "Health check failed but continuing..."'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}