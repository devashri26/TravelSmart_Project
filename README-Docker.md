# TravelSmart - Full Stack Travel Booking Application

A complete travel booking application with Spring Boot backend, React frontend, and MySQL database - all running in a single Docker container.

## Features

- **Backend**: Spring Boot REST API (Port 8080)
- **Frontend**: React with Vite dev server (Port 5173)
- **Database**: MySQL 8.0 (Port 3306)
- **Process Management**: Supervisor for managing all services

## Quick Start

```bash
docker run -d \
  --name travelsmart \
  -p 8080:8080 \
  -p 5173:5173 \
  -p 3306:3306 \
  devagauri/travelsmart:latest
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **MySQL**: localhost:3306 (root/root)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| MYSQL_ROOT_PASSWORD | root | MySQL root password |
| MYSQL_DATABASE | travelsmartdb | Database name |
| JWT_SECRET | mySecretKey | JWT signing secret |
| JWT_EXPIRATION | 86400000 | JWT expiration time (ms) |

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/flights` - Search flights
- `GET /api/hotels` - Search hotels

## Development

The container runs all services using supervisor:
- MySQL database initialization
- Spring Boot backend
- React frontend (Vite dev server)

## Logs

View application logs:
```bash
docker logs travelsmart
```

## Support

For issues and questions, please visit the GitHub repository.