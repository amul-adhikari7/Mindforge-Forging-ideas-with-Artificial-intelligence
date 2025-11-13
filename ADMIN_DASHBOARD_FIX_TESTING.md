# Admin Dashboard 403 Fix - Testing Checklist

## Overview
Fixed admin dashboard 403 errors and client-side "Error fetching dashboard" by:
1. Creating dedicated `authorizeRoles()` middleware for role-based access control
2. Improving error handling in AppContext with specific 401/403 handling
3. Adding request/response interceptors with detailed logging
4. Adding `/api/auth/me` debug endpoint

---

## Changes Made

### Backend

#### 1. **Updated `server/middlewares/auth.js`**
- ✅ Split token verification from role authorization
- ✅ New `verifyToken()`: Attaches `req.user = { id, email, role }`
- ✅ New `authorizeRoles(...roles)` middleware: Returns 403 with `{ success: false, code: "forbidden", message: "..." }`
- ✅ Added `[AUTH]` tagged console logs for debugging

#### 2. **Updated `server/routes/adminRoutes.js`**
- ✅ Added `authorizeRoles("admin")` middleware to protected routes
- ✅ Routes now chain: `verifyToken` → `authorizeRoles("admin")` → handler

#### 3. **Updated `server/controllers/adminController.js`**
- ✅ Removed duplicate role checks (now in middleware)
- ✅ `getDashboard()` returns 200 + `{ success: true, dashboardData }`
- ✅ Consistent error responses

#### 4. **Updated `server/routes/authRoutes.js`**
- ✅ Added `GET /api/auth/me` debug endpoint
- ✅ Returns current user info if token is valid

### Frontend

#### 1. **Updated `client/context/AppContext.jsx`**
- ✅ Enhanced axios response interceptor
- ✅ Catches 401: logs "Token invalid or expired" + logout
- ✅ Catches 403: logs "Access denied" + shows user-friendly toast
- ✅ Catches network errors with specific messages
- ✅ Request interceptor logs API calls
- ✅ `fetchDashboard()` now handles 401/403 separately

---

## Testing Checklist

### Phase 1: Backend Token Verification

#### Test 1.1: Valid Token
```bash
# Get a valid token by logging in as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Save token from response: TOKEN="eyJ..."

# Test /api/auth/me endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected Response:
# HTTP 200
# { "success": true, "user": { "id": "...", "email": "...", "role": "admin" } }
```
- [ ] Returns 200 with valid user object
- [ ] Logs: `[AUTH] Token verified for admin@example.com (role: admin)`

#### Test 1.2: Missing Token
```bash
curl -X GET http://localhost:5000/api/auth/me
```
- [ ] Returns 401
- [ ] Response: `{ "success": false, "code": "no_token", "message": "..." }`
- [ ] Logs: `[AUTH] Missing Authorization header`

#### Test 1.3: Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid.token.here"
```
- [ ] Returns 401
- [ ] Response: `{ "success": false, "code": "invalid_token", "message": "..." }`
- [ ] Logs: `[AUTH] Token verification failed`

---

### Phase 2: Admin Authorization

#### Test 2.1: Admin Access to Dashboard
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
- [ ] Returns 200
- [ ] Response: `{ "success": true, "dashboardData": { ... } }`
- [ ] Logs: `[AUTH] Access granted for admin@example.com to GET /dashboard`

#### Test 2.2: Non-Admin Access Denied
```bash
# First create a regular user token (if you have user auth)
# Or simulate by creating a JWT manually with role: "user"
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $USER_TOKEN"
```
- [ ] Returns 403
- [ ] Response: `{ "success": false, "code": "forbidden", "message": "Access denied..." }`
- [ ] Logs: `[AUTH] Access denied for user@example.com (role: user) trying to access GET /dashboard`

---

### Phase 3: Frontend Error Handling

#### Test 3.1: Login as Admin (Client)
1. Open http://localhost:3000 (or 5173)
2. Navigate to Admin Login page
3. Enter admin credentials (from .env)
4. Click "Login"
- [ ] Successfully logs in
- [ ] Redirected to /admin/dashboard
- [ ] No console errors
- [ ] Console shows: `[API] GET /api/admin/dashboard`

#### Test 3.2: Valid Dashboard Display
1. On /admin/dashboard
2. Check DevTools Network tab
- [ ] `GET /api/admin/dashboard` returns 200
- [ ] Response includes: `dashboardData.blogs`, `dashboardData.comments`, `dashboardData.user`
- [ ] Dashboard displays: blog count, comment count, draft count, user email

#### Test 3.3: 403 Error Handling (Non-Admin User)
1. Manually create a non-admin user token (or modify token JWT manually)
2. Store in localStorage: `token = {non-admin-jwt}`
3. Refresh page or navigate to /admin/dashboard
- [ ] Toast appears: "Admin access required. Contact system administrator."
- [ ] Console logs: `[Dashboard] Access denied (403) - User lacks admin role`
- [ ] User redirected to home page

#### Test 3.4: 401 Error Handling (Expired Token)
1. Login as admin
2. Modify stored token to corrupt it slightly (in DevTools)
3. Refresh page or navigate away and back to admin page
- [ ] Toast appears: "Your session has expired. Please login again."
- [ ] Redirected to login page
- [ ] Console logs: `[API] 401 Unauthorized - Token invalid or expired`

#### Test 3.5: Network Error Handling
1. Turn off internet/network
2. Try to navigate to admin dashboard
- [ ] Toast appears: "Network error. Please check your connection."
- [ ] Console logs: `[API] Network error - check connection`

---

### Phase 4: Console Logging

#### Check Server Logs for Clear Auth Messages
```
[AUTH] Token verified for admin@example.com (role: admin)
[AUTH] Access granted for admin@example.com to GET /api/admin/dashboard
```
- [ ] Each request has `[AUTH]` tag
- [ ] Easy to identify who did what
- [ ] Error logs clearly indicate 401/403 reason

#### Check Browser Console for Clear Client Messages
```
[API] GET /api/admin/dashboard
[Dashboard] Access granted
[API] 403 Forbidden - Access denied
```
- [ ] Messages tagged with `[API]` or `[Dashboard]`
- [ ] No cryptic error codes
- [ ] Clear reason for each error

---

### Phase 5: Edge Cases

#### Test 5.1: Multiple Tabs
1. Login in Tab 1
2. Delete token in localStorage from DevTools (Tab 1)
3. Switch to Tab 2
- [ ] Tab 2 detects invalid token
- [ ] Shows appropriate error message

#### Test 5.2: Token Expiration
1. Login and get token
2. Wait for token to expire (adjust exp in JWT if needed for testing)
3. Try to access protected route
- [ ] Returns 401
- [ ] Client logs out user
- [ ] Shows "Session expired" message

#### Test 5.3: Role Changes (after login)
1. Admin logs in
2. Manually change role in localStorage token
3. Try to fetch dashboard
- [ ] 403 error appears
- [ ] Shows "Admin access required"

---

## Quick Debug Commands

### Get Current User Info
```bash
# Replace $TOKEN with actual token
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Get Admin Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq .token
```

### Test Dashboard Route
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r .token)

curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Browser DevTools Inspection

### Network Tab
1. Login as admin
2. Open DevTools → Network tab
3. Perform an action that calls dashboard
4. Click on the request
5. Check:
   - **Request Headers**: Has `Authorization: Bearer ...`?
   - **Status**: Is it 200 (success) or 403 (forbidden)?
   - **Response**: Has `success: true/false` and appropriate data?

### Application Tab - LocalStorage
1. After login, check `localStorage.token`
2. Decode the JWT (use https://jwt.io or similar)
3. Verify payload has: `{ id, email, role, exp }`

### Console Tab
1. Look for `[AUTH]` and `[API]` tagged messages
2. Should show request/response flow clearly
3. No uncaught AxiosError exceptions

---

## Expected Behavior After Fix

| Scenario | Before Fix | After Fix |
|----------|-----------|-----------|
| Admin accesses dashboard | ❌ 403 "Admin access required" (confusing) | ✅ 200 + dashboard data |
| Non-admin accesses dashboard | ❌ AxiosError + generic error toast | ✅ Toast: "Admin access required" |
| Token expired | ❌ Generic error | ✅ Toast: "Session expired" + logout |
| Network error | ❌ Unclear message | ✅ Toast: "Network error. Check connection." |
| Missing token | ❌ 401 with no context | ✅ 401 with `code: "no_token"` |

---

## Rollback (if needed)

If tests fail, revert changes:
```bash
git diff HEAD~1 -- \
  server/middlewares/auth.js \
  server/routes/adminRoutes.js \
  client/context/AppContext.jsx

git checkout HEAD~1 -- <files>
```

---

## Success Criteria

- ✅ Admin can access dashboard without 403 errors
- ✅ Non-admin users see clear "Admin required" message
- ✅ Expired tokens trigger logout + clear message
- ✅ Console logs show clear `[AUTH]` / `[API]` tags
- ✅ No AxiosError exceptions in browser console
- ✅ All 4 error scenarios handled: 401, 403, network, server

---

## Files Modified

1. `server/middlewares/auth.js` - New `authorizeRoles()` middleware
2. `server/routes/adminRoutes.js` - Added role checks
3. `server/controllers/adminController.js` - Removed duplicate checks
4. `server/routes/authRoutes.js` - Added `/me` endpoint
5. `client/context/AppContext.jsx` - Enhanced error handling + interceptors

---

**Status: Ready for Testing** ✅
