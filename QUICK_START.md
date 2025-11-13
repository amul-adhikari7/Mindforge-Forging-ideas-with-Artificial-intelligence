# Quick Start - Run Full Stack Application

## Prerequisites
- Node.js v14 or higher installed
- MongoDB cluster created (MongoDB Atlas)
- Git (optional)

## Setup Steps

### 1. Clone or navigate to project
```bash
cd "C:\Users\User\OneDrive\Desktop\projects\fullstack\Blog"
```

### 2. Set up environment variables

**Backend (.env in server directory):**
```bash
cd server
# Create .env file with:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Frontend (already configured):**
- Uses `VITE_BASE_URL = http://localhost:5000` automatically

### 3. Install dependencies (one time only)
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Start the application

**Option A: Two Terminal Windows (Recommended)**

Terminal 1 - Start Backend:
```bash
cd server
npm run server
# Starts on http://localhost:5000
```

Terminal 2 - Start Frontend:
```bash
cd client
npm run dev
# Starts on http://localhost:5173
```

**Option B: Sequential Start**

```bash
# Start backend
cd server && npm run server &

# In another terminal, start frontend
cd client && npm run dev
```

### 5. Access Application

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| API | http://localhost:5000 | Backend API |
| Vite Dev Tools | http://localhost:5173/__vite_ping | Vite status |

## First Time Setup

### Create Test User
1. Navigate to http://localhost:5173
2. Click "Sign Up" 
3. Enter details:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
4. Click Sign Up

### Login
1. Click "Login"
2. Enter:
   - Email: test@example.com
   - Password: Test123!
3. You'll be logged in and redirected to home

### Create Your First Blog
1. Click "My Blogs" or "Add Blog" in sidebar
2. Fill in:
   - Title
   - Description (rich text editor)
   - Content (AI can help generate)
3. Click "Add Blog" to save
4. Toggle "Publish" to make it visible

## Common Issues & Solutions

### Backend won't start
```
Error: Cannot find package 'bcryptjs'
→ Run: npm install bcryptjs

Error: MONGODB_URI not set
→ Create .env file with MONGODB_URI

Error: Port 5000 in use
→ Change PORT in .env or stop other process
```

### Frontend won't start
```
Error: Cannot find module
→ Run: npm install in client folder

Error: Port 5173 in use
→ Vite will auto-select next available port

Error: API connection refused
→ Check backend is running on localhost:5000
```

### MongoDB connection fails
```
Error: Connection timeout
→ Check MONGODB_URI in .env

Error: Authentication failed
→ Check username/password in connection string

Error: IP not whitelisted
→ Add your IP to MongoDB Atlas whitelist
```

## File Structure

```
Blog/
├── server/                    # Backend (Node.js + Express)
│   ├── server.js             # Main entry point
│   ├── package.json          # Backend dependencies
│   ├── .env                  # Environment variables (create this)
│   ├── configs/              # Configuration files
│   ├── controllers/          # Business logic
│   ├── models/               # Database schemas
│   ├── routes/               # API endpoints
│   └── middlewares/          # Auth, upload, etc.
│
├── client/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── components/      # Reusable components
│   │   └── pages/           # Page components
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
└── Documentation files...
```

## Development Commands

### Backend
```bash
cd server

npm run server      # Start with nodemon (hot reload)
npm start          # Start with node (no hot reload)
npm install        # Install dependencies
npm list           # List installed packages
npm audit          # Check for vulnerabilities
```

### Frontend
```bash
cd client

npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm install        # Install dependencies
```

## Testing API Endpoints

### Test backend is responding
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:5000/ -UseBasicParsing | Select-Object -ExpandProperty Content
# Response: API is working fine
```

### Test user registration
```bash
Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Test","email":"test@example.com","password":"Test123"}' | 
  Select-Object -ExpandProperty Content
```

## Production Deployment

### Backend
```bash
# Set NODE_ENV to production
set NODE_ENV=production

# Use production start command
npm start

# Or use pm2 for process management
npm install -g pm2
pm2 start server.js --name "blog-api"
```

### Frontend
```bash
# Build for production
npm run build

# Outputs to dist/ folder - deploy to web server or CDN
```

## Support Documentation

- **API Reference**: See GETTING_STARTED.md
- **Authentication Guide**: See AUTHENTICATION_GUIDE.md
- **Backend Fixes**: See BACKEND_STARTUP_FIXED.md
- **API Connection**: See API_CONNECTION_FIX.md

## Key Features

✅ User authentication (signup/login)
✅ Role-based access control (user/admin)
✅ Create, read, update, delete blogs
✅ Rich text editor with formatting
✅ AI-powered content generation (Google Gemini)
✅ Comment system
✅ Image upload with ImageKit
✅ Responsive design (mobile-friendly)
✅ MongoDB for data persistence
✅ JWT token-based authentication

---

**Happy coding! 🚀**

For detailed setup instructions, see GETTING_STARTED.md
For troubleshooting, see BACKEND_STARTUP_FIXED.md
