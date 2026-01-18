# Micro-Disaster Alert System

A comprehensive disaster management and alert system built with React, Node.js, Express, and MongoDB.

## 📋 Overview

This application provides real-time disaster alerts, analytics, and emergency information. It uses AI to analyze disaster images and automatically categorize incidents.

### Features

- 🔐 **User Authentication** - Secure login and registration
- 🚨 **Alert Management** - Create, view, and delete disaster alerts
- 📊 **Analytics Dashboard** - Visualize trends and statistics
- 🗺️ **Map View** - Interactive map showing alert locations
- 📞 **Emergency Contacts** - Quick access to emergency numbers
- 👤 **User Profiles** - Manage personal information
- 🤖 **AI-Powered** - Automatic disaster type detection from images

## 🏗️ Architecture

```
why/
├── client/          # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and API client
│   │   ├── store/       # Zustand state management
│   │   └── types/       # TypeScript type definitions
│   └── public/      # Static assets
│
└── server/         # Node.js backend (Express)
    ├── config/     # Database configuration
    ├── controllers/# Route handlers
    ├── middleware/ # Auth middleware
    ├── models/     # MongoDB models
    ├── routes/     # API routes
    ├── services/   # Business logic
    ├── utils/      # Helper functions
    └── validators/ # Input validation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd why
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

### Configuration

#### Backend (.env)
Create a `server/.env` file with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
WEATHER_API_KEY=your_weather_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
The `client/.env` file should contain:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📱 Application Routes

### Authentication
- `/login` - User login
- `/register` - User registration

### Main Application
- `/dashboard` - Overview and statistics
- `/alerts` - Browse all alerts
- `/alerts/create` - Create new alert
- `/map` - Map view of alerts
- `/analytics` - Detailed analytics
- `/emergency` - Emergency contacts
- `/profile` - User profile management

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Alerts
- `GET /api/alerts` - Get alerts (last 24 hours)
- `GET /api/alerts/history` - Get all alerts
- `GET /api/alerts/map` - Get alerts for map view
- `POST /api/alerts` - Create new alert (with image upload)
- `DELETE /api/alerts/:id` - Delete alert

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Analytics
- `GET /api/analytics/dashboard` - Get complete analytics dashboard

### Emergency
- `GET /api/emergency` - Get all emergency numbers
- `GET /api/emergency/:category` - Get emergency numbers by category
- `POST /api/emergency` - Create emergency number (admin)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **UI Components:** shadcn/ui with Radix UI
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Form Handling:** React Hook Form + Zod
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **AI Integration:** Groq SDK, Google Gemini
- **Storage:** Supabase (for images)
- **Email:** Nodemailer

## 🎨 UI Components

The application uses shadcn/ui components built on Radix UI primitives:
- Avatar, Badge, Button, Card, Chart
- Dialog, Dropdown Menu, Form, Input, Label
- Select, Separator, Sheet, Sidebar, Skeleton
- Sonner (Toast), Table, Tooltip

## 🔒 Authentication Flow

1. User registers with username, email, and password
2. Backend hashes password with bcrypt
3. JWT token generated on successful login
4. Token stored in localStorage and Zustand store
5. Token sent in Authorization header for protected routes
6. Backend middleware validates token on protected routes

## 📊 Features Breakdown

### Alert Creation
1. Upload disaster image
2. Set severity level (low/medium/high)
3. Provide location (manual or geolocation)
4. AI analyzes image and determines disaster type
5. Alert stored in MongoDB with metadata

### Analytics
- Total alerts count
- Severity distribution (high/medium/low)
- Alerts over time (line chart)
- Alert type distribution (bar chart)
- Top affected locations
- Confidence score distribution

### Map View
- Interactive Google Maps integration
- Markers for each alert location
- Click to view alert details
- Real-time location updates

## 🐛 Troubleshooting

### Frontend Issues

**CORS errors:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check `server/server.js` CORS settings

**API connection failed:**
- Verify `VITE_API_URL` in `client/.env`
- Ensure backend is running on port 5000

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Clear Vite cache: `rm -rf dist node_modules/.vite`

### Backend Issues

**Database connection failed:**
- Check MongoDB connection string in `server/.env`
- Ensure MongoDB is running
- Verify network access in MongoDB Atlas

**Authentication errors:**
- Verify JWT_SECRET is set in `server/.env`
- Check token expiration settings

**File upload issues:**
- Verify Supabase credentials
- Check multer configuration
- Ensure proper file permissions

## 📝 Environment Variables Reference

### Required Backend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT signing | random_string_here |
| GROQ_API_KEY | Groq AI API key | gsk_... |
| SUPABASE_URL | Supabase project URL | https://xxx.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service key | eyJ... |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Required Frontend Variables
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

Bhaskar Sisodiya

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- TanStack Query for data fetching
- Recharts for data visualization
- The open-source community
