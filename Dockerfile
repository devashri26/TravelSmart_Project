# ---------- Stage 1: Build Spring Boot Backend ----------
FROM eclipse-temurin:17-jdk-jammy AS backend-build
WORKDIR /backend

COPY TravelSmart/ .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests


# ---------- Stage 2: Final Runtime Image ----------
FROM ubuntu:22.04
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# Install Java 17, Node.js 20, MySQL, Supervisor
RUN apt-get update && apt-get install -y \
    curl \
    openjdk-17-jre-headless \
    mysql-server \
    supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy backend jar
COPY --from=backend-build /backend/target/*.jar /app/app.jar

# Copy frontend source (to run Vite dev server)
COPY travelsmart-frontend /app/frontend
WORKDIR /app/frontend
RUN npm install

# Copy supervisor config & db init script
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY init-db.sh /app/init-db.sh
RUN chmod +x /app/init-db.sh



EXPOSE 8080 
EXPOSE 5173 
EXPOSE 3306

CMD ["/usr/bin/supervisord", "-n"]
