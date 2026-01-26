# Jenkins CI/CD Setup for TravelSmart

## 🚀 Quick Setup Guide

### 1. Access Jenkins
- **URL**: http://localhost:8086
- **Initial Password**: `92b3b6fb2c714001a96b86e7911dc3ec`

### 2. Initial Jenkins Configuration

1. **Install Suggested Plugins** when prompted
2. **Create Admin User**
3. **Install Additional Plugins**:
   - Docker Pipeline
   - GitHub Integration
   - Email Extension
   - Test Results Analyzer
   - Blue Ocean (optional, for better UI)

### 3. Configure Credentials

Go to **Manage Jenkins > Manage Credentials > Global**:

#### Docker Hub Credentials:
- **Kind**: Username with password
- **ID**: `dockerhub-credentials`
- **Username**: `devagauri`
- **Password**: Your Docker Hub password

#### GitHub Credentials (if using private repo):
- **Kind**: Username with password or SSH key
- **ID**: `github-credentials`
- **Username**: Your GitHub username
- **Password**: GitHub personal access token

### 4. Create Pipeline Job

1. **New Item** > **Pipeline**
2. **Name**: `TravelSmart-CI-CD`
3. **Pipeline Definition**: Pipeline script from SCM
4. **SCM**: Git
5. **Repository URL**: Your GitHub repository URL
6. **Credentials**: Select your GitHub credentials
7. **Branch**: `*/main`
8. **Script Path**: `Jenkinsfile`

### 5. Configure Webhooks (Optional)

In your GitHub repository:
1. Go to **Settings > Webhooks**
2. **Add webhook**
3. **Payload URL**: `http://your-jenkins-url:8086/github-webhook/`
4. **Content type**: `application/json`
5. **Events**: Push events, Pull requests

### 6. Environment Variables

Set these in **Manage Jenkins > Configure System > Global Properties**:

```
DOCKER_HUB_REPO=devagauri/travelsmart
MYSQL_ROOT_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret-key
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
AVIATION_STACK_API_KEY=your-api-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## 🔄 Pipeline Stages

1. **Checkout** - Get source code
2. **Build Backend** - Compile Spring Boot app
3. **Test Backend** - Run unit tests
4. **Build Frontend** - Build React app
5. **Test Frontend** - Run frontend tests
6. **Package** - Create JAR file
7. **Build Docker Image** - Create container image
8. **Security Scan** - Scan for vulnerabilities
9. **Push to Docker Hub** - Upload image
10. **Deploy to Staging** - Deploy for testing
11. **Integration Tests** - Test deployed app
12. **Deploy to Production** - Manual approval required

## 🌍 Deployment URLs

- **Staging**: http://localhost:8087 (Backend), http://localhost:5174 (Frontend)
- **Production**: http://localhost:8080 (Backend), http://localhost:5173 (Frontend)

## 📧 Notifications

The pipeline sends email notifications on:
- ✅ Successful builds
- ❌ Failed builds
- 🚀 Deployments

## 🔧 Manual Commands

### Deploy Staging:
```bash
docker-compose -f docker-compose.staging.yml up -d
```

### Deploy Production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### View Logs:
```bash
docker logs travelsmart-prod -f
```

## 🛡️ Security Features

- Docker image vulnerability scanning
- Secure credential management
- Environment-specific configurations
- Health checks and monitoring