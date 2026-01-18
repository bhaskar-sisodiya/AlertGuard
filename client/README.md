# Micro-Disaster Alert System - Frontend

React-based frontend for the Micro-Disaster Alert System built with Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - Component library
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **React Router v7** - Routing
- **React Hook Form + Zod** - Form handling and validation
- **Recharts** - Charts and data visualization
- **Lucide React** - Icons

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── app-layout.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── protected-route.tsx
│   │   └── public-route.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── use-alerts.ts
│   │   ├── use-analytics.ts
│   │   ├── use-auth.ts
│   │   ├── use-emergency.ts
│   │   ├── use-mobile.ts
│   │   └── use-user.ts
│   ├── lib/            # Utilities
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── pages/          # Page components
│   │   ├── alerts.tsx
│   │   ├── analytics.tsx
│   │   ├── create-alert.tsx
│   │   ├── dashboard.tsx
│   │   ├── emergency.tsx
│   │   ├── login.tsx
│   │   ├── map.tsx
│   │   ├── profile.tsx
│   │   └── register.tsx
│   ├── store/          # Zustand stores
│   │   └── auth-store.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── components.json     # shadcn/ui config
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

### Build
```bash
npm run build
```
Creates a production build in the `dist` folder

### Preview
```bash
npm run preview
```
Preview the production build locally

### Lint
```bash
npm run lint
```
Run ESLint to check code quality

## Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## Styling Guidelines

This project uses Tailwind CSS v4 with the following conventions:

### Theme Colors
- Use CSS variables defined in `src/index.css`
- Severity colors: `text-severity-high`, `text-severity-medium`, `text-severity-low`
- Theme colors: `bg-primary`, `text-primary`, `bg-secondary`, etc.

### Components
- Use shadcn/ui components from `@/components/ui`
- Apply custom styles using Tailwind utility classes
- Use `cn()` utility from `@/lib/utils` to merge class names

### Dark Mode
- Automatic dark mode support via Tailwind
- Use `dark:` prefix for dark mode variants

## API Integration

The frontend connects to the backend API using the `apiClient` utility:

```typescript
import { apiClient } from '@/lib/api-client'

// GET request
const data = await apiClient.get<ResponseType>('/endpoint')

// POST request
const result = await apiClient.post<ResponseType>('/endpoint', { data })

// File upload
const formData = new FormData()
formData.append('file', file)
const uploaded = await apiClient.upload<ResponseType>('/endpoint', formData)
```

## State Management

### Authentication State (Zustand)
```typescript
import { useAuthStore } from '@/store/auth-store'

const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore()
```

### Server State (TanStack Query)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: () => apiClient.get('/endpoint')
})

// Mutate data
const mutation = useMutation({
  mutationFn: (data) => apiClient.post('/endpoint', data),
  onSuccess: () => {
    // Handle success
  }
})
```

## Routing

The app uses React Router v7 with declarative routing:

- **Public Routes**: Login, Register
- **Protected Routes**: Dashboard, Alerts, Map, Analytics, Emergency, Profile

Protected routes require authentication and redirect to login if not authenticated.

## Form Handling

Forms use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

## Icons

Icons are from Lucide React:

```typescript
import { AlertTriangle, MapPin, User } from 'lucide-react'

<AlertTriangle className="h-4 w-4" />
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with dynamic imports
- Image optimization with lazy loading
- Memoization of expensive computations
- Query caching with TanStack Query
- Proper loading and error states

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module not found errors
```bash
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Build fails
```bash
# Clear Vite cache
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

## Contributing

Please read the main README.md for contribution guidelines.