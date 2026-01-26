-- Update the role column to support ROLE_SUPER_ADMIN
ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;

-- Optionally, create a super admin user manually
INSERT INTO users (username, email, password, role, enabled, locked)
VALUES ('superadmin', 'superadmin@travelsmart.com', 
        '$2a$10$YourEncodedPasswordHere', 'ROLE_SUPER_ADMIN', TRUE, FALSE)
ON DUPLICATE KEY UPDATE role = 'ROLE_SUPER_ADMIN';
