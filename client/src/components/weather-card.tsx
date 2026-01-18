import { useWeather } from '@/hooks/use-weather'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Cloud, Droplets, Wind, Eye, Gauge } from 'lucide-react'

export function WeatherCard() {
  const { data: weather, isLoading, error, isError } = useWeather()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Conditions</CardTitle>
          <CardDescription>Unable to load weather data</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Please set your location in your profile to view weather information.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Conditions</CardTitle>
        <CardDescription>
          {weather.location.name}, {weather.location.region}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text}
              className="w-16 h-16"
            />
            <div>
              <p className="text-4xl font-bold">{Math.round(weather.current.temp_c)}°C</p>
              <p className="text-sm text-muted-foreground">{weather.current.condition.text}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-muted-foreground">
              Feels like {Math.round(weather.current.feelslike_c)}°C
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-medium">{weather.current.wind_kph} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-medium">{weather.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-sm font-medium">{weather.current.pressure_mb} mb</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium">{weather.current.vis_km} km</p>
            </div>
          </div>
        </div>

        {weather.current.precip_mm > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Cloud className="h-4 w-4 text-blue-600" />
            <p className="text-sm">
              Precipitation: {weather.current.precip_mm}mm
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
