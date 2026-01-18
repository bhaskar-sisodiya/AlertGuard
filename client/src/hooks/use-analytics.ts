import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { AnalyticsDashboard } from '@/types'

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => apiClient.get<AnalyticsDashboard>('/analytics/dashboard'),
  })
}