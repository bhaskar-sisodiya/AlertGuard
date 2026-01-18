import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth-store'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient.post<AuthResponse>('/auth/login', credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      // Redirect admin to admin dashboard, others to user dashboard
      if (data.user.role?.toLowerCase() === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      apiClient.post<AuthResponse>('/auth/register', credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      // Redirect admin to admin dashboard, others to user dashboard
      if (data.user.role?.toLowerCase() === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return () => {
    clearAuth()
    queryClient.clear()
    // Use window.location to ensure clean redirect to landing page
    window.location.href = '/'
  }
}