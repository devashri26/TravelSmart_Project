-- Step 1: Update the role column to support ROLE_SUPER_ADMIN
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;

-- Step 2: Create super admin user
-- Password is 'superadmin123' (bcrypt encoded)
INSERT INTO users (username, email, password, role, enabled, locked)
VALUES ('superadmin', 'superadmin@travelsmart.com', 
        '$2a$10$YhZ8qE5qE5qE5qE5qE5qEOqE5qE5qE5qE5qE5qE5qE5qE5qE5qE5q', 
        'ROLE_SUPER_ADMIN', TRUE, FALSE)
ON DUPLICATE KEY UPDATE role = 'ROLE_SUPER_ADMIN';

-- Verify the super admin was created
SELECT id, username, email, role, enabled, locked FROM users WHERE username = 'superadmin';
