import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute } from '@/components/protected-route'
import { PublicRoute } from '@/components/public-route'
import { AppLayout } from '@/components/app-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { DashboardPage } from '@/pages/dashboard'
import { AlertsPage } from '@/pages/alerts'
import { CreateAlertPage } from '@/pages/create-alert'
import { MapPage } from '@/pages/map'
import { AnalyticsPage } from '@/pages/analytics'
import { EmergencyPage } from '@/pages/emergency'
import { ProfilePage } from '@/pages/profile'
import { AdminDashboardPage } from '@/pages/admin-dashboard'
import { AdminUsersPage } from '@/pages/admin-users'
import { AdminAlertsPage } from '@/pages/admin-alerts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/alerts/create" element={<CreateAlertPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/alerts" element={<AdminAlertsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App