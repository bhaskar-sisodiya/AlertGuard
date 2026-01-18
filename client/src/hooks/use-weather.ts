import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useUserProfile } from '@/hooks/use-user'
import type { WeatherData } from '@/types'

export function useWeather() {
  const { data: userProfile } = useUserProfile()
  const location = userProfile?.location || userProfile?.locationKey

  return useQuery({
    queryKey: ['weather', location],
    queryFn: () => apiClient.get<WeatherData>(`/weather?location=${encodeURIComponent(location || '')}`),
    enabled: !!location,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  })
}
