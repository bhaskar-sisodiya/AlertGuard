# Quick Setup Guide

## Prerequisites
- Node.js v18 or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Backend Setup

```powershell
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# - Add your MongoDB connection string
# - Add your JWT secret (use a random string)
# - Add your Groq API key (if using AI features)
# - Add your Supabase credentials (for image storage)
notepad .env
```

**Important Environment Variables:**
- `MONGO_URI`: Get from MongoDB Atlas or use local: `mongodb://localhost:27017/disaster-alerts`
- `JWT_SECRET`: Generate a random string (e.g., using online generator)
- `GROQ_API_KEY`: Get from https://console.groq.com/keys
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Get from https://supabase.com

### 2. Frontend Setup

```powershell
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create environment file (already exists, verify it)
# Ensure VITE_API_URL points to your backend
notepad .env
```

### 3. Start Development Servers

**Open TWO separate terminal windows/tabs:**

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```
You should see: `✅ Server running on port 5000`

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```
You should see: `Local: http://localhost:5173/`

### 4. Access the Application

Open your browser and navigate to: `http://localhost:5173`

## Default Test Account

If you've seeded the database, you can use:
- Email: `test@example.com`
- Password: `password123`

Or create a new account using the registration page.

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file has correct MongoDB URI
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `client/.env` has `VITE_API_URL=http://localhost:5000/api`
- Check CORS settings in `server/server.js`

### Build errors
```powershell
# Clear and reinstall dependencies
cd client
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Or for server
cd server
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Database connection issues
- Ensure MongoDB is running (if local)
- Check MongoDB Atlas IP whitelist (if cloud)
- Verify connection string format

## Production Deployment

### Build Frontend
```powershell
cd client
npm run build
# Outputs to client/dist
```

### Deploy Options
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, Heroku, or VPS
- **Database**: MongoDB Atlas (recommended)

## Next Steps

1. Register a new account
2. Create your first alert
3. Explore the analytics dashboard
4. Check the map view
5. Browse emergency contacts

## Support

For issues or questions, please check the main README.md file or create an issue in the repository.