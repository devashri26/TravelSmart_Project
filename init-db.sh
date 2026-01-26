#!/bin/bash
set -e

echo "⏳ Waiting for MySQL to be ready..."
until mysqladmin ping -h 127.0.0.1 -uroot --silent; do
  sleep 2
done

echo "✅ MySQL is ready. Configuring DB + root access..."

mysql -uroot <<EOF
-- Create DB
CREATE DATABASE IF NOT EXISTS travelsmartdb;

-- Fix root login (Ubuntu MySQL uses auth_socket by default)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';

-- Allow root from any host (optional but useful in Docker)
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
EOF

echo "✅ DB initialized successfully!"
