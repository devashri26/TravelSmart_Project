-- Fix Super Admin Password
-- This will update the password to the correct bcrypt hash

USE travelsmart;

-- Check current super admin user
SELECT id, username, email, role, password FROM users WHERE username = 'superadmin';

-- Update with correct bcrypt hash for password "superadmin123"
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIrsOdvOkJyBC.8lLKQ6FYLhR6x6vy8m'
WHERE username = 'superadmin';

-- Verify the update
SELECT id, username, email, role, enabled, locked FROM users WHERE username = 'superadmin';

-- The password field should now start with $2a$10$
-- Login credentials:
-- Username: superadmin
-- Password: superadmin123
