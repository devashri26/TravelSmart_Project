# 🔐 Admin Login Guide

## How to Login as Admin

### Step 1: Create an Admin User in Database

You need to manually create an admin user in your database. Run this SQL query:

```sql
-- First, check if the user exists
SELECT * FROM users WHERE username = 'admin';

-- If not exists, insert a new admin user
INSERT INTO users (username, email, password, role, locked, enabled) 
VALUES (
  'admin', 
  'admin@travelsmart.com', 
  '$2a$10$YourBcryptHashedPasswordHere',  -- Replace with bcrypt hashed password
  'ROLE_ADMIN', 
  false, 
  true
);

-- Or update an existing user to admin
UPDATE users 
SET role = 'ROLE_ADMIN', enabled = true 
WHERE username = 'your_username';
```

### Step 2: Generate Bcrypt Password Hash

You can use an online bcrypt generator or run this in your Spring Boot app:

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";  // Your desired password
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("Hashed Password: " + hashedPassword);
    }
}
```

### Step 3: Login via Frontend

1. Go to `http://localhost:5173/login`
2. Enter your admin credentials:
   - Username: `admin`
   - Password: `admin123` (or whatever you set)
3. Click "Login"

### Step 4: Access Admin Panel

After successful login:
1. Click on your profile icon in the top-right corner
2. You should see "Admin Panel" option in the dropdown (with purple shield icon)
3. Click "Admin Panel" to go to `/admin`

Or directly navigate to:
- `/admin` - Dashboard
- `/admin/bookings` - Bookings Management
- `/admin/payments` - Payments Management
- `/admin/users` - User Management

## Troubleshooting

### Issue: "Admin Panel" link not showing

**Check:**
1. Open browser console (F12)
2. Look for the login response logs
3. Verify the role is `ROLE_ADMIN`

**Solution:**
```javascript
// The frontend now checks for both formats:
user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN'
```

### Issue: Redirected to dashboard when accessing /admin

**Check:**
1. Verify your user role in localStorage:
   ```javascript
   // In browser console:
   JSON.parse(localStorage.getItem('auth-storage'))
   ```
2. The role should be `ROLE_ADMIN`

**Solution:**
If role is wrong, update it in database and login again.

### Issue: Backend returns 403 Forbidden

**Check:**
1. Your backend security configuration
2. JWT token is valid
3. User has ROLE_ADMIN in database

**Solution:**
Add admin endpoints to your SecurityConfig:
```java
.requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
```

## Role Format

The backend uses Spring Security's role format:
- **Database:** `ROLE_ADMIN`, `ROLE_USER`
- **Frontend:** Accepts both `ROLE_ADMIN` and `ADMIN`
- **Display:** Shows as "ROLE_ADMIN" in profile

## Quick Test User

For testing, you can create a test admin user:

```sql
-- Test Admin User
INSERT INTO users (username, email, password, role, locked, enabled) 
VALUES (
  'testadmin', 
  'testadmin@travelsmart.com', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- password: admin123
  'ROLE_ADMIN', 
  false, 
  true
);
```

**Credentials:**
- Username: `testadmin`
- Password: `admin123`

## Security Notes

⚠️ **Important:**
1. Never use simple passwords in production
2. Always use strong bcrypt hashed passwords
3. Enable email verification for admin accounts
4. Consider adding 2FA for admin accounts
5. Log all admin actions for audit trail

## Next Steps

Once logged in as admin, you can:
1. ✅ View dashboard statistics
2. ✅ Manage all bookings
3. ✅ View and process payments
4. ✅ Manage users (block/unblock)
5. ✅ Export reports (UI ready)

All features are working with mock data. Connect to your backend APIs to use real data!
