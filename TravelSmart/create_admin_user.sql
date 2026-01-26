-- Create Admin User for TravelSmart
-- Password: admin123 (BCrypt encoded)
-- Run this in your MySQL database

USE travel_db;

-- Insert admin user
-- Password is 'admin123' (BCrypt hash)
INSERT INTO users (username, email, password, role, enabled, locked)
VALUES (
    'admin',
    'admin@travelsmart.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ROLE_ADMIN',
    1,
    0
);

-- Insert regular test user
-- Password is 'user123' (BCrypt hash)
INSERT INTO users (username, email, password, role, enabled, locked)
VALUES (
    'testuser',
    'user@travelsmart.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi',
    'ROLE_USER',
    1,
    0
);

-- Verify the users were created
SELECT id, username, email, role, enabled, locked FROM users;
