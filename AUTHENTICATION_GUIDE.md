# Multi-User Authentication & Role-Based Access Implementation Guide

## Overview
Your Mindforge blog project has been enhanced with full multi-user authentication, signup/login functionality, and role-based access control. This guide explains all the changes and how to use the new features.

---

## Backend Implementation

### 1. Database Models

#### User Model (`server/models/userModel.js`)
- **Fields**: `name`, `email`, `password` (hashed with bcrypt), `role`
- **Roles**: `reader` (default), `author`, `admin`
- **Timestamps**: `createdAt`, `updatedAt`

#### Updated Blog Model (`server/models/blogModel.js`)
- New fields: `userId` (reference to User), `author` (author name)
- Maintains backward compatibility with existing blogs

### 2. Authentication Middleware (`server/middlewares/authMiddleware.js`)

#### `verifyToken` Middleware
- Validates JWT tokens from `Authorization: Bearer <token>` header
- Attaches decoded user info to `req.user`
- Returns 401 if token is missing or invalid

#### `authorizeRoles(...roles)` Middleware
- Checks if user has required role(s)
- Returns 403 if user lacks required permissions
- Example: `authorizeRoles('admin', 'author')`

### 3. Authentication Routes (`server/routes/authRoutes.js`)

#### POST `/api/auth/register`
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "author"  // optional, defaults to "reader"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "author"
  }
}
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "securepass123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "author"
  }
}
```

### 4. Updated Blog Routes (`server/routes/blogRoutes.js`)

#### Public Routes (No auth required)
- `GET /api/blog/all` - List all published blogs
- `GET /api/blog/:blogId` - Get single blog
- `GET /api/blog/user/:userId` - Get all blogs for a user
- `POST /api/blog/add-comment` - Add comment
- `POST /api/blog/comments` - Get approved comments

#### Protected Routes (Auth + Role required)
- `POST /api/blog/add` - Create blog (requires: `admin` or `author`)
- `POST /api/blog/delete` - Delete blog (requires: `admin` or `author`)
- `POST /api/blog/toggle-publish` - Publish/unpublish (requires: `admin` or `author`)
- `POST /api/blog/generate` - AI content generation (requires: `admin` or `author`)

### 5. Authentication Controller (`server/controllers/authController.js`)

#### `register(req, res)`
- Validates input (name, email, password)
- Checks for duplicate email
- Hashes password using bcrypt (salt = 10)
- Creates user with default role "reader"
- Returns JWT token (expires in 7 days)

#### `login(req, res)`
- Validates credentials
- Compares password with bcrypt
- Returns JWT token (expires in 7 days)

---

## Frontend Implementation

### 1. New Pages

#### Signup Page (`client/src/pages/Signup.jsx`)
- Registration form with fields: name, email, password, confirm password, role
- Client-side validation
- Stores JWT and user info in localStorage
- Redirects to home after successful signup

#### Login Page (`client/src/pages/Login.jsx`)
- Login form with email and password
- Stores JWT and user info in localStorage
- Redirects to home after successful login
- Link to signup page and admin login

#### My Blogs Page (`client/src/pages/MyBlogs.jsx`)
- Display user's blogs in a card grid
- Actions: Publish/Unpublish, Delete
- Create new blog button
- Protected route (requires authentication)

### 2. Updated Components

#### Navbar (`client/src/components/Navbar.jsx`)
**When Logged Out:**
- Shows "Login" and "Sign Up" buttons
- "Admin Login" link in footer

**When Logged In:**
- Displays user profile (avatar with first letter, name)
- Shows "My Blogs" link (if author or admin)
- Shows "Admin" button (if admin only)
- "Logout" button

**Role-based Visibility:**
- `My Blogs` link only visible to authors and admins
- Admin dashboard only visible to admin users

#### AddBlog (`client/src/components/pages/admin/AddBlog.jsx`)
- Authorization check on mount
- Only accessible to `admin` or `author` roles
- Redirects to login if not authenticated
- Redirects to home if insufficient permissions

#### ListBlog (`client/src/components/pages/admin/ListBlog.jsx`)
- Authorization check on mount
- Only accessible to `admin` or `author` roles
- Displays all blogs (admin view)
- Edit/Delete/Publish-toggle actions

### 3. Updated AppContext (`client/context/AppContext.jsx`)

#### New State Management
```javascript
// Token & User are persisted to localStorage
const [token, setToken] = useState(() => localStorage.getItem('token'))
const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))

// Persisted setUser that saves to localStorage
const setUser = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData))
}
```

#### New Functions
- `logout()` - Clears token, user, and redirects to home

#### Updated Functions
- `login()` - Now returns JWT instead of fetching admin dashboard
- `setToken` - Setter for JWT token
- `setUser` - Setter that persists user to localStorage

#### Axios Configuration
- `publicAxios` - For public API calls (no auth header)
- `authAxios` - For protected API calls (includes Bearer token)
- Automatic token refresh in interceptors

### 4. Updated Routes (`client/src/App.jsx`)

```javascript
// New Public Routes
<Route path='/signup' element={<Signup />} />
<Route path='/login' element={<Login />} />
<Route path='/my-blogs' element={<MyBlogs />} />

// Separate admin login
<Route path='/admin/login' element={<AdminLogin />} />
```

---

## User Flows

### Registration Flow
1. User visits `/signup`
2. Fills form: name, email, password, role
3. Frontend validates input
4. POST to `/api/auth/register`
5. Backend hashes password, creates user
6. Returns JWT + user info
7. Frontend stores in localStorage
8. Redirects to home page

### Login Flow
1. User visits `/login`
2. Fills email and password
3. POST to `/api/auth/login`
4. Backend validates credentials
5. Returns JWT + user info
6. Frontend stores in localStorage
7. Redirects to home page

### Create Blog Flow (Author)
1. Logged-in author clicks "Create New Blog"
2. Navigates to `/admin/addBlog`
3. Authorization check passes (user.role = "author")
4. Fill blog details and content
5. Upload image
6. Submit form
7. Frontend sends POST to `/api/blog/add` with Bearer token
8. Backend verifies token and role
9. Creates blog with userId and author fields
10. Returns success message
11. Redirects to `/my-blogs`

### View My Blogs Flow
1. Logged-in author/admin visits `/my-blogs`
2. Frontend fetches GET `/api/blog/user/:userId`
3. Backend returns only blogs with matching userId
4. Display in card grid
5. Can publish/unpublish or delete each blog

---

## Role Permissions

| Feature | Reader | Author | Admin |
|---------|--------|--------|-------|
| View public blogs | ✅ | ✅ | ✅ |
| View moments | ✅ | ✅ | ✅ |
| Create blog | ❌ | ✅ | ✅ |
| Edit own blog | ❌ | ✅ | ✅ |
| Delete own blog | ❌ | ✅ | ✅ |
| View all blogs (admin) | ❌ | ❌ | ✅ |
| Approve comments | ❌ | ❌ | ✅ |
| View dashboard | ❌ | ❌ | ✅ |
| Create moments | ❌ | ❌ | ✅ |

---

## Environment Variables

### Backend (.env)
```
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@example.com  # For legacy admin login
ADMIN_PASSWORD=admin_pass       # For legacy admin login
```

### Frontend (.env)
```
VITE_BASE_URL=http://localhost:3000
```

---

## Testing Guide

### 1. Register New User
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "author"
}
```

### 2. Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Create Blog (with token)
```bash
POST http://localhost:3000/api/blog/add
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Form Data:
- blog: {"title":"...", "subTitle":"...", "description":"...", "category":"...", "isPublished":true}
- image: <image file>
```

### 4. Get User Blogs
```bash
GET http://localhost:3000/api/blog/user/{userId}
```

---

## Security Considerations

1. **Password Hashing**: All passwords hashed with bcrypt (salt rounds: 10)
2. **JWT Tokens**: Signed with JWT_SECRET, expires in 7 days
3. **Protected Routes**: All create/edit/delete operations require valid JWT
4. **Role-Based Access**: Backend validates user role for sensitive operations
5. **Secure Storage**: Tokens stored in localStorage (note: consider httpOnly cookies for production)
6. **CORS**: Frontend and backend configured with CORS headers

---

## Migration Notes

### For Existing Blogs
- Old blogs created without userId will still be viewable
- Can be migrated by adding userId manually or through admin interface
- New blogs always include userId and author fields

### Admin Login
- Legacy admin login (via `/admin/login`) still works
- Uses environment variable credentials
- New multi-user authentication is separate at `/api/auth/register` and `/api/auth/login`

---

## Future Enhancements

1. **Email Verification**: Send verification email on signup
2. **Password Reset**: Implement forgot password flow
3. **OAuth**: Add GitHub/Google login
4. **Blog Drafts**: Save drafts without publishing
5. **Collaboration**: Multiple authors on single blog
6. **Comments Moderation**: Author approval + Admin approval
7. **User Profiles**: Public author profiles with bio
8. **Blog Stats**: View/likes analytics

---

## Support & Troubleshooting

### "Token expired" Error
- Clear localStorage and login again
- Tokens expire after 7 days

### "Access denied" Error
- Check user role (must be "author" or "admin" for blog creation)
- Ensure Bearer token is included in Authorization header

### User can't create blogs
- Verify role is "author" or "admin" during signup
- Check database User model

### CORS Errors
- Ensure VITE_BASE_URL matches backend URL
- Check server CORS configuration

---

## File Summary

### Backend Files Created/Modified
```
✅ server/models/userModel.js (NEW)
✅ server/middlewares/authMiddleware.js (NEW)
✅ server/controllers/authController.js (NEW)
✅ server/routes/authRoutes.js (NEW)
✅ server/models/blogModel.js (MODIFIED)
✅ server/controllers/blogController.js (MODIFIED)
✅ server/routes/blogRoutes.js (MODIFIED)
✅ server/server.js (MODIFIED)
```

### Frontend Files Created/Modified
```
✅ client/src/pages/Signup.jsx (NEW)
✅ client/src/pages/Login.jsx (NEW)
✅ client/src/pages/MyBlogs.jsx (NEW)
✅ client/context/AppContext.jsx (MODIFIED)
✅ client/src/components/Navbar.jsx (MODIFIED)
✅ client/src/components/pages/admin/AddBlog.jsx (MODIFIED)
✅ client/src/components/pages/admin/ListBlog.jsx (MODIFIED)
✅ client/src/App.jsx (MODIFIED)
```

---

## Next Steps

1. **Install Dependencies** (if not already)
   ```bash
   npm install bcryptjs jsonwebtoken
   ```

2. **Update .env** with JWT_SECRET

3. **Run Database Migrations** (create User collection in MongoDB)

4. **Test Registration & Login** via frontend or Postman

5. **Create Test User** with "author" role

6. **Test Blog Creation** with new auth system

7. **Deploy** following your standard process

---

**Implementation Date**: November 13, 2025
**Status**: Complete and Ready for Testing
