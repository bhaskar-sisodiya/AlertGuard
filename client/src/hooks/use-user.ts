import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth-store'
import type { User } from '@/types'

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.get<User>('/users/profile'),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)

  return useMutation({
    mutationFn: (data: Partial<User>) =>
      apiClient.put<{ message: string; user: User }>('/users/profile', data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user', 'profile'], response.user)
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
      if (token) {
        setAuth(response.user, token)
      }
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)
      
      return apiClient.upload<{ message: string; user: User }>('/users/profile', formData, 'PUT')
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['user', 'profile'], response.user)
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
      if (token && response.user) {
        setAuth(response.user, token)
      }
    },
  })
}