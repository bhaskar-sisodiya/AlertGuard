import { useAlertsForMap } from '@/hooks/use-alerts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom markers for different severity levels
const createCustomIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f97316' : '#eab308'
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 18px;
        ">!</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

// Component to handle map view changes
function ChangeMapView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  
  return null
}

export function MapPage() {
  const { data: alerts, isLoading } = useAlertsForMap()
  const [selectedAlert, setSelectedAlert] = useState<number>(0)

  const currentAlert = alerts?.[selectedAlert]
  const centerLat = currentAlert?.lat || 28.7041
  const centerLng = currentAlert?.lng || 77.1025

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground">Visualize alerts on an interactive map</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alert Locations</CardTitle>
            <CardDescription>
              {alerts?.length || 0} active alerts in the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border h-[600px]">
              <MapContainer
                center={[centerLat, centerLng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ChangeMapView center={[centerLat, centerLng]} zoom={13} />
                
                {alerts?.map((alert) => (
                  <Marker
                    key={alert._id}
                    position={[alert.lat, alert.lng]}
                    icon={createCustomIcon(alert.severity)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold capitalize mb-1">{alert.type}</h3>
                        <p className="text-sm text-gray-600 mb-2">{alert.location || 'Unknown Location'}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                            className={
                              alert.severity === 'high' 
                                ? '' 
                                : alert.severity === 'medium'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        {alert.reason && (
                          <p className="text-xs text-gray-500 mt-2">{alert.reason}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert List</CardTitle>
            <CardDescription>Click to view on map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-auto">
              {alerts?.map((alert, index) => (
                <button
                  key={alert._id}
                  onClick={() => setSelectedAlert(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedAlert === index 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium capitalize text-sm">{alert.type}</p>
                    <Badge 
                      variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                      className={
                        alert.severity === 'high' 
                          ? 'shrink-0' 
                          : alert.severity === 'medium'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 shrink-0'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 shrink-0'
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{alert.location || `${alert.lat.toFixed(4)}, ${alert.lng.toFixed(4)}`}</span>
                  </div>
                </button>
              ))}
              {(!alerts || alerts.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No alerts to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}