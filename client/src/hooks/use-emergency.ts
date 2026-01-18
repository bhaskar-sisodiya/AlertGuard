import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { EmergencyNumber } from '@/types'

export function useEmergencyNumbers() {
  return useQuery({
    queryKey: ['emergency-numbers'],
    queryFn: () => apiClient.get<EmergencyNumber[]>('/emergency'),
  })
}

export function useEmergencyByCategory(category: string) {
  return useQuery({
    queryKey: ['emergency-numbers', category],
    queryFn: () => apiClient.get<EmergencyNumber>(`/emergency/${category}`),
    enabled: !!category,
  })
}

export function useCreateEmergencyNumber() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<EmergencyNumber, '_id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<EmergencyNumber>('/emergency', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-numbers'] })
    },
  })
}