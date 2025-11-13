# 🚀 Getting Started - After Axios Fix

## Pre-Flight Checklist

Before starting the servers, make sure:

### 1. Dependencies Installed
```powershell
# Backend dependencies
cd server
npm install bcryptjs jsonwebtoken  # Required for auth
npm install  # Ensure all packages installed

# Frontend dependencies  
cd ../client
npm install  # Ensure all packages installed
```

### 2. Environment Files
```powershell
# Frontend .env file (client/.env)
VITE_BASE_URL = http://localhost:5000

# Backend .env file (server/.env) - if not exists, create it
PORT=5000
JWT_SECRET=your_secret_key_here
MONGODB_URI=your_mongodb_connection_string
```

### 3. MongoDB Running
```powershell
# If using MongoDB locally, ensure it's running
# MongoDB Compass or shell should show connection
```

---

## Starting the Application

### Terminal 1: Start Backend
```powershell
cd server
npm run server
```

**Expected Output:**
```
Server is running on http://localhost:5000
CORS enabled for origins: [ 'http://localhost:5173' ]
```

### Terminal 2: Start Frontend (New Terminal)
```powershell
cd client
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### Terminal 3: (Optional) MongoDB Shell
```powershell
mongosh
# Should connect to MongoDB without errors
```

---

## Browser Setup

### 1. Open Application
Navigate to: **http://localhost:5173**

### 2. Enable Developer Tools
Press **F12** or **Ctrl+Shift+I**

### 3. Check Console Tab
Should see NO errors like:
- ❌ ERR_CONNECTION_REFUSED
- ❌ CORS error
- ❌ Network Error

Should see console messages like:
- ✅ "API is working fine"
- ✅ Blogs loading
- ✅ Moments loading

### 4. Check Network Tab
Click "Network" tab and refresh page

**Expected:**
- All requests to `http://localhost:5000/*` 
- Status codes should be **200** for success
- CORS headers should be present
- No red (failed) requests

---

## Test Each Feature

### Feature 1: View Blogs (Public)
```
1. Navigate to http://localhost:5173/
2. Should see blog cards loading
3. Check Network tab: GET /api/blog/all → 200 OK
4. No console errors
```

### Feature 2: View Moments (Public)
```
1. Navigate to http://localhost:5173/moments
2. Should see moment cards loading
3. Check Network tab: GET /api/moments → 200 OK
4. No console errors
```

### Feature 3: User Signup
```
1. Navigate to http://localhost:5173/signup
2. Fill form: name, email, password, select role
3. Click Submit
4. Check Network: POST /api/auth/register → 201 Created
5. Should redirect to home page
6. Check localStorage: token and user should exist
```

### Feature 4: User Login
```
1. Navigate to http://localhost:5173/login
2. Fill email and password
3. Click Submit
4. Check Network: POST /api/auth/login → 200 OK
5. Should redirect to home or dashboard
6. Navbar should show logged-in user
```

### Feature 5: Create Blog (Author/Admin)
```
1. Login with author/admin account
2. Click "Create New Blog" or go to /admin/addBlog
3. Fill blog details
4. Click Submit
5. Check Network: POST /api/blog/add → 201 Created
6. Should redirect to /my-blogs
7. Your blog should appear in the list
```

### Feature 6: View My Blogs
```
1. After login, click "My Blogs" link
2. Should see your created blogs
3. Check Network: GET /api/blog/user/{userId} → 200 OK
4. Cards should display with Publish/Delete buttons
```

### Feature 7: Admin Dashboard
```
1. Login with admin account
2. Click "Admin" button in navbar
3. Should show admin dashboard
4. Check Network: GET /api/admin/dashboard → 200 OK
5. Should display dashboard data
```

---

## Troubleshooting Checklist

### ❌ Still Getting Connection Errors?

**Step 1: Verify Backend**
```powershell
# Check if backend is running
netstat -ano | findstr ":5000"
# Should show: LISTENING

# Or test the API directly
curl http://localhost:5000/
# Should return: "API is working fine"
```

**Step 2: Verify Frontend .env**
```powershell
# Check the file content
type client\.env
# Should show: VITE_BASE_URL = http://localhost:5000
```

**Step 3: Clear Browser Cache**
```
In DevTools Settings:
- Network → Check "Disable cache (while DevTools is open)"
- Or manually: Ctrl+Shift+Delete
Then refresh: Ctrl+R or F5
```

**Step 4: Restart Everything**
```powershell
# Stop all running processes (Ctrl+C in each terminal)

# Kill any remaining node processes
taskkill /F /IM node.exe

# Start backend again
cd server && npm run server

# Start frontend again (new terminal)
cd client && npm run dev
```

**Step 5: Check Logs**
```
Backend logs (where npm run server runs):
- Should show "Server is running on http://localhost:5000"
- Should show "CORS enabled for origins: [ 'http://localhost:5173' ]"

Frontend logs (Browser DevTools → Console):
- Should see no errors
- May see axios requests being made
```

### ❌ Getting 404 Not Found?

**Cause:** Endpoint doesn't exist or path is wrong

**Solution:**
```
1. Check Network tab for actual URL being requested
2. It should be: http://localhost:5000/api/blog/all
3. Not: http://localhost:5000/api/blog/all (missing leading /)
4. Verify backend routes exist in server/routes/
5. Check no typos in endpoint paths
```

### ❌ Getting 401 Unauthorized?

**Cause:** Missing or invalid authentication token

**Solution:**
```
1. Login first if needed
2. Check localStorage for 'token' key
3. Check Network tab → Request Headers → Authorization header
4. Should be: "Bearer <token>"
5. Verify token is not expired
6. Check backend is checking Authorization header
```

### ❌ Getting CORS Error?

**Cause:** Frontend origin not in CORS whitelist

**Solution:**
```
1. Check server/server.js CORS configuration
2. Should include: 'http://localhost:5173'
3. Restart backend server
4. Check browser console error message for details
5. Verify frontend is actually on port 5173
```

---

## Database Setup

### If Using MongoDB Atlas (Cloud)

1. Create account at mongodb.com/cloud
2. Create free cluster
3. Get connection string
4. Add to `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```
5. Restart backend

### If Using Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Verify connection:
   ```powershell
   mongosh
   # Should connect and show test> prompt
   ```
4. Set in `server/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/mindforge
   ```
5. Restart backend

---

## Common Commands

```powershell
# View all running processes on ports
netstat -ano

# Check if port 5000 is in use
netstat -ano | findstr ":5000"

# Kill process on port 5000
taskkill /F /PID <PID>

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
cd server && rm -r node_modules && npm install
cd ../client && rm -r node_modules && npm install

# View environment variables
echo $env:VITE_BASE_URL  # PowerShell

# Test API endpoint with curl
curl http://localhost:5000/api/blog/all

# View .env file
cat client\.env
type server\.env
```

---

## Development Tips

### 1. Use React DevTools
- Install "React Developer Tools" browser extension
- Can inspect component state and props
- Helps debug issues

### 2. Use Network Tab
- Monitor all API requests
- Check request/response headers
- Verify CORS headers present
- See actual error responses

### 3. Use Console Tab
- View all console.error() and console.log()
- Check for JavaScript errors
- See API error messages

### 4. Use Application Tab
- View localStorage keys
- Check token and user data
- Clear cache if needed

### 5. Inspect Network Requests
```
In Network tab, click on request:
- Headers → Check Authorization header
- Payload/Request Body → See what data sent
- Response → See what server returned
- Preview → See formatted response
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Update `VITE_BASE_URL` to production API URL
- [ ] Update `FRONTEND_URL` in backend .env
- [ ] Set `NODE_ENV=production` in backend
- [ ] Generate new `JWT_SECRET` for production
- [ ] Update MongoDB connection string to production
- [ ] Enable HTTPS (not HTTP)
- [ ] Add production domain to CORS whitelist
- [ ] Review security settings
- [ ] Test all features in production environment
- [ ] Set up monitoring/logging
- [ ] Create database backups

---

## Support Resources

**If you encounter issues:**

1. Check the documentation files:
   - `API_CONNECTION_FIX.md` - Technical details
   - `AUTHENTICATION_GUIDE.md` - Auth system
   - `API_CONNECTION_QUICK_FIX.md` - Quick reference

2. Check server logs for errors

3. Check browser console for JavaScript errors

4. Check Network tab for failed requests

5. Verify all environment variables are set

6. Restart both servers

---

## Next Steps

1. ✅ Start backend server
2. ✅ Start frontend server
3. ✅ Open http://localhost:5173 in browser
4. ✅ Test features listed above
5. ✅ Check browser console and Network tab
6. ✅ Create test user account
7. ✅ Create test blog
8. ✅ View admin dashboard
9. ✅ Deploy to production when ready

---

**Status:** ✅ Ready to Start
**Last Updated:** November 13, 2025
