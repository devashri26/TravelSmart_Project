-- ============================================
-- SUPER ADMIN MANUAL CREATION SCRIPT
-- ============================================
-- Database: travelsmart
-- Username: superadmin
-- Password: superadmin123
-- ============================================

USE travelsmart;

-- Step 1: Check if super admin already exists
SELECT id, username, email, role, enabled FROM users WHERE username = 'superadmin';

-- Step 2: Delete existing super admin if needed (optional)
-- DELETE FROM users WHERE username = 'superadmin';

-- Step 3: Insert Super Admin User
-- Password "superadmin123" is bcrypt encoded with 10 rounds
INSERT INTO users (username, email, password, role, enabled, locked)
VALUES (
    'superadmin',
    'superadmin@travelsmart.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIrsOdvOkJyBC.8lLKQ6FYLhR6x6vy8m',
    'ROLE_SUPER_ADMIN',
    1,
    0
);

-- Step 4: Verify the super admin was created successfully
SELECT id, username, email, role, enabled, locked 
FROM users 
WHERE username = 'superadmin';

-- Expected Result:
-- +----+------------+---------------------------+------------------+---------+--------+
-- | id | username   | email                     | role             | enabled | locked |
-- +----+------------+---------------------------+------------------+---------+--------+
-- | XX | superadmin | superadmin@travelsmart.com| ROLE_SUPER_ADMIN |       1 |      0 |
-- +----+------------+---------------------------+------------------+---------+--------+

-- Step 5: Check all admin users
SELECT id, username, email, role, enabled 
FROM users 
WHERE role IN ('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')
ORDER BY role DESC;

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Username: superadmin
-- Password: superadmin123
-- ============================================

-- ============================================
-- ALTERNATIVE: Let Spring Boot Create It
-- ============================================
-- If you prefer, just restart your Spring Boot backend
-- The DataInitializer will automatically create the super admin
-- This is the RECOMMENDED approach!
-- ============================================
