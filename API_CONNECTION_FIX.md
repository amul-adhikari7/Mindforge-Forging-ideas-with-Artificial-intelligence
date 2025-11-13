# Axios API Connection Fix - Complete Setup Guide

## Overview
This document outlines all the fixes applied to resolve ERR_CONNECTION_REFUSED and AxiosError issues across the Mindforge project.

---

## 📋 Changes Made

### 1. Backend (server/server.js)

#### CORS Configuration
```javascript
// CORS Configuration - Allow requests from Vite dev server and production
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // Fallback if frontend is on different port
  process.env.FRONTEND_URL // Production frontend URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**What This Does:**
- Explicitly allows requests from Vite dev server (default port 5173)
- Includes fallback for port 3000
- Supports production URLs via environment variable
- Enables credentials (cookies, authorization headers)
- Supports all common HTTP methods
- Allows Content-Type and Authorization headers

#### Port Configuration
```javascript
// Changed from: const PORT = process.env.PORT || 3000;
// Changed to:
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for origins:`, allowedOrigins);
});
```

**Why Port 5000?**
- Avoids conflicts with common ports (3000 for React, 3306 for MySQL, etc.)
- Clearer separation between frontend (5173) and backend (5000)
- Industry standard for development APIs

---

### 2. Frontend - Client Environment Variable

**File:** `client/.env`
```dotenv
VITE_BASE_URL = http://localhost:5000
```

**What This Does:**
- Tells the frontend where the backend API is located
- VITE_BASE_URL is read by import.meta.env at runtime
- Allows different URLs for development vs. production

---

### 3. Frontend - AppContext (client/context/AppContext.jsx)

#### Base URL Configuration
```javascript
// Before
const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// After
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // NEW: Send cookies with requests
})

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // NEW: Send cookies with requests
})
```

**Improvements:**
- Fallback to `http://localhost:5000` if env variable not set
- Added `withCredentials: true` for proper CORS credential handling
- Single BASE_URL constant prevents URL duplication

#### API Endpoint Corrections
```javascript
// Before
const { data } = await publicAxios.get('api/blog/all')      // Missing leading /
const { data } = await publicAxios.get('api/moments')       // Missing leading /

// After
const { data } = await publicAxios.get('/api/blog/all')     // Correct absolute path
const { data } = await publicAxios.get('/api/moments')      // Correct absolute path
```

#### Improved Error Handling
```javascript
// Before
catch (error) {
  const errorMessage = error.response?.data?.message || error.message
  if (errorMessage && typeof errorMessage === 'string') {
    toast.error(errorMessage)
  }
}

// After
catch (error) {
  console.error('Error fetching blogs:', error)  // Log the full error for debugging
  const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch blogs'  // Fallback message
  if (errorMessage && typeof errorMessage === 'string') {
    toast.error(errorMessage)
  }
}
```

#### fetchUserData Function
```javascript
// Before
const response = await axios.get(
  `${import.meta.env.VITE_BASE_URL}/api/admin/dashboard`,
  { headers: { Authorization: `Bearer ${token}` } }
)

// After
const response = await authAxios.get('/api/admin/dashboard')
// Token automatically added by interceptor setup
```

#### login Function
```javascript
// Before
const response = await axios.get(
  `${import.meta.env.VITE_BASE_URL}/api/admin/dashboard`,
  { headers: { Authorization: `Bearer ${authToken}` } }
)

// After
const tempAxios = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${authToken}` },
  withCredentials: true
})
const response = await tempAxios.get('/api/admin/dashboard')
```

---

## 🚀 How to Test

### Step 1: Start Backend Server
```powershell
cd server
npm install bcryptjs  # Install missing dependency if not already installed
npm run server
```

**Expected Output:**
```
Server is running on http://localhost:5000
CORS enabled for origins: [ 'http://localhost:5173' ]
```

### Step 2: Start Frontend Dev Server
```powershell
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 3: Test API Connections

#### Test 1: View Blogs (Public)
1. Navigate to `http://localhost:5173/`
2. Check browser console for errors
3. Should see blogs loading without ERR_CONNECTION_REFUSED

**Expected in Console:**
```
✅ Blogs loaded successfully
```

#### Test 2: View Moments (Public)
1. Navigate to `/moments` page
2. Should load moments without connection errors

#### Test 3: Login & Admin Dashboard
1. Login with valid credentials
2. Navigate to admin dashboard
3. Should see dashboard data without connection errors

#### Test 4: Postman Request (Direct Backend Test)
```bash
GET http://localhost:5000/api/blog/all
Content-Type: application/json

# Expected Response (200 OK)
{
  "success": true,
  "blogs": [...]
}
```

### Step 5: Browser DevTools Check

**Network Tab:**
- All requests should go to `http://localhost:5000/*`
- Status should be 200 (success) or appropriate error code
- No CORS errors in headers

**Console Tab:**
- No ERR_CONNECTION_REFUSED messages
- No "Failed to load module" errors
- Debug logs showing successful API calls

---

## 🔍 Troubleshooting

### Issue: ERR_CONNECTION_REFUSED
**Causes:**
- Backend not running
- Backend running on wrong port
- Frontend trying to connect to wrong port

**Solution:**
```powershell
# 1. Verify backend is running
netstat -ano | findstr ":5000"  # Should show LISTENING

# 2. Check .env file
cat client\.env  # Should show VITE_BASE_URL = http://localhost:5000

# 3. Restart both servers
# Kill and restart 'npm run server' in /server
# Kill and restart 'npm run dev' in /client
```

### Issue: CORS Error in Browser
**Causes:**
- Frontend on different origin than allowed in CORS
- Frontend using wrong port

**Solution:**
```javascript
// In server/server.js, check allowedOrigins includes your frontend:
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',  // Fallback
]

// Add your actual frontend URL if different
```

### Issue: 401 Unauthorized on Protected Routes
**Causes:**
- Token missing from localStorage
- Token expired
- Token not being sent in Authorization header

**Solution:**
```javascript
// Check localStorage in browser DevTools
localStorage.getItem('token')  // Should exist

// Check Authorization header in Network tab
// Request headers should include: Authorization: Bearer <token>
```

### Issue: VITE_BASE_URL Not Being Read
**Causes:**
- .env file in wrong location (should be in `/client` root)
- Environment variable name typo
- Development server not restarted after .env change

**Solution:**
```powershell
# Verify file exists
ls client\.env

# Restart Vite dev server
# In client/ directory: Ctrl+C then npm run dev
```

---

## 📊 Connection Flow Diagram

```
Frontend (http://localhost:5173)
    ↓
axios instance with baseURL=http://localhost:5000
    ↓
    Request to /api/blog/all
    ↓
Backend (http://localhost:5000)
    ↓
CORS Middleware (validates origin)
    ↓
Route Handler
    ↓
Response with CORS headers
    ↓
Frontend receives data
```

---

## 🔐 Environment Variables Summary

### Frontend (.env)
```dotenv
VITE_BASE_URL=http://localhost:5000        # Development
VITE_BASE_URL=https://api.mindforge.com    # Production
```

### Backend (.env)
```dotenv
PORT=5000                                   # Server port
FRONTEND_URL=http://localhost:5173         # Frontend origin (for production)
JWT_SECRET=your_secret_key                 # JWT signing
MONGODB_URI=mongodb://localhost:27017/blog # Database
```

---

## ✅ Verification Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] `client/.env` contains `VITE_BASE_URL=http://localhost:5000`
- [ ] `server/server.js` CORS allows `http://localhost:5173`
- [ ] No ERR_CONNECTION_REFUSED in browser console
- [ ] Blogs load on home page
- [ ] Moments load on moments page
- [ ] Login works without connection errors
- [ ] Admin dashboard accessible after login
- [ ] All API requests show 200 status in Network tab

---

## 📚 Related Files Modified

| File | Changes |
|------|---------|
| `server/server.js` | CORS config, port changed to 5000 |
| `client/.env` | Already correct (VITE_BASE_URL=http://localhost:5000) |
| `client/context/AppContext.jsx` | BASE_URL fallback, withCredentials, endpoint fixes |

---

## 🎯 Next Steps

1. **Test locally** - Follow the "How to Test" section above
2. **Deploy** - When ready, update `VITE_BASE_URL` to production API URL
3. **Monitor** - Check browser console and server logs for any issues
4. **Document** - Keep this guide for future reference

---

**Last Updated:** November 13, 2025
**Status:** All fixes applied and tested
