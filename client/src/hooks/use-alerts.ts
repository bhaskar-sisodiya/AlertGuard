import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Alert, PaginatedAlerts } from '@/types'

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => apiClient.get<Alert[]>('/alerts'),
  })
}

export function useAlertsHistory() {
  return useQuery({
    queryKey: ['alerts', 'history'],
    queryFn: async () => {
      const data = await apiClient.get<PaginatedAlerts>('/alerts/history')
      return data.alerts
    },
  })
}

export function useAlertsForMap() {
  return useQuery({
    queryKey: ['alerts', 'map'],
    queryFn: () => apiClient.get<Alert[]>('/alerts/map'),
  })
}

export function useCreateAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.upload<Alert>('/alerts', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

export function useDeleteAlert() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ message: string }>(`/alerts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}