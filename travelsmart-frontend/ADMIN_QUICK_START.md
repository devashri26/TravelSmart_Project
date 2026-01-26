# 🚀 Admin Panel - Quick Start

## 1️⃣ Create Admin User (SQL)

```sql
-- Update existing user to admin
UPDATE users 
SET role = 'ROLE_ADMIN', enabled = true 
WHERE email = 'your@email.com';

-- OR create new admin user (password: admin123)
INSERT INTO users (username, email, password, role, locked, enabled) 
VALUES (
  'admin', 
  'admin@travelsmart.com', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ROLE_ADMIN', 
  false, 
  true
);
```

## 2️⃣ Login

1. Go to: `http://localhost:5173/login`
2. Enter admin credentials
3. Click "Login"

## 3️⃣ Access Admin Panel

**Option A:** Click profile icon → "Admin Panel"

**Option B:** Direct URLs:
- `http://localhost:5173/admin` - Dashboard
- `http://localhost:5173/admin/bookings` - Bookings
- `http://localhost:5173/admin/payments` - Payments
- `http://localhost:5173/admin/users` - Users

## ✅ What's Working

- ✅ Dashboard with real-time stats
- ✅ Bookings management (search, filter, cancel)
- ✅ Payments tracking (search, filter, refunds)
- ✅ User management (search, filter, block/unblock)
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Mock data for testing

## 🔧 Backend Integration

All pages use mock data. To connect to backend:

1. Ensure backend has these endpoints:
   - `GET /api/v1/admin/dashboard/stats`
   - `GET /api/v1/admin/bookings`
   - `GET /api/v1/admin/payments`
   - `GET /api/v1/admin/users`

2. Uncomment API calls in components:
   ```javascript
   // Replace mock data with:
   const response = await adminService.getAllBookings(page, size);
   ```

## 🐛 Troubleshooting

**Admin Panel link not showing?**
- Check role in console: `JSON.parse(localStorage.getItem('auth-storage'))`
- Should be: `role: "ROLE_ADMIN"`

**Can't access /admin?**
- Verify database role is `ROLE_ADMIN` (not `ADMIN`)
- Clear localStorage and login again

**403 Forbidden?**
- Add to backend SecurityConfig:
  ```java
  .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
  ```

## 📚 Full Documentation

- `ADMIN_LOGIN_GUIDE.md` - Detailed login guide
- `ADMIN_FIX_SUMMARY.md` - Technical fix details
- `ADMIN_IMPLEMENTATION_GUIDE.md` - Complete feature guide
- `ADMIN_PANEL_MODULES.md` - All available modules

## 🎉 You're Ready!

Your admin panel is fully functional with mock data. Test it out and connect to your backend when ready!
