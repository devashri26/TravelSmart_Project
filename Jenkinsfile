pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'devagauri/travelsmart'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        MAVEN_OPTS = '-Dmaven.repo.local=.m2/repository'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
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
                    sh './mvnw test'
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'TravelSmart/target/surefire-reports/*.xml'
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
        
        stage('Test Frontend') {
            steps {
                echo 'Running frontend tests...'
                dir('travelsmart-frontend') {
                    sh 'npm test -- --run --reporter=junit --outputFile=test-results.xml'
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
        
        stage('Security Scan') {
            steps {
                echo 'Running security scan...'
                script {
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image ${DOCKER_HUB_REPO}:latest"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing to Docker Hub...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        def imageTag = "${DOCKER_HUB_REPO}:${BUILD_NUMBER}"
                        def latestTag = "${DOCKER_HUB_REPO}:latest"
                        
                        sh "docker push ${imageTag}"
                        sh "docker push ${latestTag}"
                    }
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
                    sh 'curl -f http://localhost:8087/actuator/health || exit 1'
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                allOf {
                    branch 'main'
                    input message: 'Deploy to production?', ok: 'Deploy'
                }
            }
            steps {
                echo 'Deploying to production environment...'
                script {
                    sh """
                        docker stop travelsmart-prod || true
                        docker rm travelsmart-prod || true
                        docker run -d --name travelsmart-prod \\
                            -p 8080:8080 \\
                            -p 5173:5173 \\
                            -e SPRING_PROFILES_ACTIVE=production \\
                            ${DOCKER_HUB_REPO}:${BUILD_NUMBER}
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
        }
        success {
            echo 'Pipeline completed successfully!'
            emailext (
                subject: "✅ TravelSmart Build #${BUILD_NUMBER} - SUCCESS",
                body: "Build completed successfully. Check: ${BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext (
                subject: "❌ TravelSmart Build #${BUILD_NUMBER} - FAILED",
                body: "Build failed. Check: ${BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}