import { useState } from 'react'
import { useAlertsHistory, useDeleteAlert } from '@/hooks/use-alerts'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, MapPin, Clock, Trash2, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function AlertsPage() {
  const { data: alerts, isLoading } = useAlertsHistory()
  const deleteAlert = useDeleteAlert()
  const user = useAuthStore((state) => state.user)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  
  // Only admin can delete - all powers with admin
  const canDelete = user?.role?.toLowerCase() === 'admin'

  const filteredAlerts = alerts?.filter((alert) => {
    if (!alert || !alert.type) return false
    const matchesSearch = 
      alert.type?.toLowerCase().includes(search.toLowerCase()) ||
      alert.location?.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesType = typeFilter === 'all' || alert.type === typeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  const uniqueTypes = Array.from(new Set(alerts?.map(a => a.type) || []))

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteAlert.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">Browse and manage all disaster alerts</p>
        </div>
        <Button asChild>
          <Link to="/alerts/create">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Create Alert
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlerts?.map((alert) => (
          <Card key={alert._id} className="overflow-hidden">
            <img 
              src={alert.imageUrl} 
              alt={alert.type}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="capitalize">{alert.type}</CardTitle>
                <Badge 
                  variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                  className={
                    alert.severity === 'high' 
                      ? '' 
                      : alert.severity === 'medium'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                  }
                >
                  {alert.severity}
                </Badge>
              </div>
              <Badge 
                variant="outline"
                className={
                  alert.status === 'resolved' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                    : alert.status === 'in_process'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                }
              >
                {alert.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <CardDescription className="space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.location || 'Unknown location'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(alert.timestamp)}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alert.reason && (
                <p className="text-sm text-muted-foreground mb-4">{alert.reason}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Confidence: {Math.round(alert.confidence * 100)}%
                </span>
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(alert._id)}
                    disabled={deleteAlert.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredAlerts || filteredAlerts.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No alerts found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {search || severityFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first alert to get started'}
            </p>
            <Button asChild>
              <Link to="/alerts/create">Create Alert</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}