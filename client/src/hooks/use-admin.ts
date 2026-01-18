import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { User } from '@/types'

export function useAllUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiClient.get<User[]>('/admin/users'),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiClient.put<{ message: string; user: User }>(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ alertId, status }: { alertId: string; status: string }) =>
      apiClient.put(`/alerts/${alertId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useAssignDma() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ alertId, dmaUserId }: { alertId: string; dmaUserId: string }) =>
      apiClient.put(`/alerts/${alertId}/assign-dma`, { dmaUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}
