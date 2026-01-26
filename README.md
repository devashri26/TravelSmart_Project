# 🌍 TravelSmart - Complete Travel Booking Platform

A full-stack travel booking application with Spring Boot backend, React frontend, MySQL database, and complete CI/CD pipeline using Jenkins and Docker.

## 🚀 Features

### 🎯 Core Functionality
- **User Authentication** - Secure login/registration with JWT
- **Flight Search & Booking** - Real-time flight search and booking
- **Hotel Search & Booking** - Hotel search with filters and booking
- **Payment Integration** - Razorpay payment gateway integration
- **Admin Panel** - Complete admin dashboard for management
- **Email Notifications** - Automated booking confirmations

### 🛠️ Technical Features
- **Microservices Architecture** - Scalable backend design
- **Responsive UI** - Mobile-first React frontend
- **Real-time APIs** - Live flight and hotel data
- **Secure Payments** - PCI compliant payment processing
- **Docker Containerization** - Easy deployment and scaling
- **CI/CD Pipeline** - Automated testing and deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Spring Boot    │    │     MySQL       │
│   (Port 5173)   │◄──►│   Backend       │◄──►│   Database      │
│                 │    │   (Port 8080)   │    │   (Port 3306)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🐳 Quick Start with Docker

### Option 1: Run from Docker Hub
```bash
docker run -d --name travelsmart -p 8080:8080 -p 5173:5173 devagauri/travelsmart:latest
```

### Option 2: Build Locally
```bash
git clone https://github.com/devashri26/TravelSmart_Project.git
cd TravelSmart_Project
docker build -t travelsmart .
docker run -d --name travelsmart -p 8080:8080 -p 5173:5173 travelsmart
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

## 🛠️ Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup
```bash
cd TravelSmart
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd travelsmart-frontend
npm install
npm run dev
```

### Database Setup
```bash
mysql -u root -p
CREATE DATABASE travelsmartdb;
```

## 📁 Project Structure

```
TravelSmart_Project/
├── TravelSmart/                 # Spring Boot Backend
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
├── travelsmart-frontend/        # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── Dockerfile                   # Multi-stage Docker build
├── Jenkinsfile                  # CI/CD Pipeline
├── docker-compose.staging.yml   # Staging environment
├── docker-compose.prod.yml      # Production environment
└── jenkins-setup.md            # Jenkins configuration guide
```

## 🔄 CI/CD Pipeline

### Jenkins Pipeline Stages
1. **Checkout** - Source code retrieval
2. **Build Backend** - Maven compilation
3. **Test Backend** - Unit tests execution
4. **Build Frontend** - React build process
5. **Test Frontend** - Frontend tests
6. **Package** - JAR file creation
7. **Docker Build** - Container image creation
8. **Security Scan** - Vulnerability assessment
9. **Push to Registry** - Docker Hub upload
10. **Deploy Staging** - Automated staging deployment
11. **Integration Tests** - End-to-end testing
12. **Deploy Production** - Manual approval required

### Setup Jenkins
```bash
# Start Jenkins
docker run -d --name jenkins -p 8086:8080 -p 50001:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# Get initial password
docker logs jenkins
```

See [jenkins-setup.md](jenkins-setup.md) for detailed configuration.

## 🌍 Deployment Environments

### Staging
- **URL**: http://localhost:8087
- **Auto-deploy**: On main branch push
- **Purpose**: Testing and QA

### Production
- **URL**: http://localhost:8080
- **Deploy**: Manual approval required
- **Purpose**: Live application

## 🔧 Configuration

### Environment Variables
```bash
# Database
MYSQL_ROOT_PASSWORD=your-password
MYSQL_DATABASE=travelsmartdb

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=86400000

# Email
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# APIs
AVIATION_STACK_API_KEY=your-api-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Flights
- `GET /api/flights/search` - Search flights
- `POST /api/flights/book` - Book flight
- `GET /api/flights/bookings` - User bookings

### Hotels
- `GET /api/hotels/search` - Search hotels
- `POST /api/hotels/book` - Book hotel
- `GET /api/hotels/bookings` - User bookings

### Admin
- `GET /api/admin/users` - Manage users
- `GET /api/admin/bookings` - View all bookings
- `POST /api/admin/flights` - Add flights

## 🧪 Testing

### Backend Tests
```bash
cd TravelSmart
./mvnw test
```

### Frontend Tests
```bash
cd travelsmart-frontend
npm test
```

### Integration Tests
```bash
# Start application
docker-compose up -d

# Run tests
curl -f http://localhost:8080/actuator/health
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - BCrypt hashing
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin security
- **Input Validation** - Request validation
- **Docker Security Scanning** - Vulnerability checks

## 📈 Monitoring & Logging

- **Health Checks** - Application health monitoring
- **Actuator Endpoints** - Spring Boot monitoring
- **Docker Logs** - Centralized logging
- **Error Tracking** - Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Devashri
- **GitHub**: [@devashri26](https://github.com/devashri26)

## 🆘 Support

For support and questions:
- Create an [Issue](https://github.com/devashri26/TravelSmart_Project/issues)
- Check [Documentation](jenkins-setup.md)
- Review [Docker Hub](https://hub.docker.com/r/devagauri/travelsmart)

## 🎯 Roadmap

- [ ] Kubernetes deployment
- [ ] Microservices architecture
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---

⭐ **Star this repository if you find it helpful!**