import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlerts } from '@/hooks/use-alerts'
import { useAnalyticsDashboard } from '@/hooks/use-analytics'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, TrendingUp, MapPin, Clock, Activity, Shield } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { WeatherCard } from '@/components/weather-card'

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data: alerts, isLoading: alertsLoading } = useAlerts()
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsDashboard()

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user?.role?.toLowerCase() === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [user, navigate])

  if (alertsLoading || analyticsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statusCounts = analytics?.statusKpi.reduce((acc, item) => {
    acc[item._id] = item.count
    return acc
  }, {} as Record<string, number>) || {}

  const stats = [
    {
      title: 'Total Alerts',
      value: analytics?.summary.totalAlerts || 0,
      description: `${statusCounts.no_action || 0} pending action`,
      icon: AlertTriangle,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'In Process',
      value: statusCounts.in_process || 0,
      description: 'Currently being handled',
      icon: Activity,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-950',
    },
    {
      title: 'Resolved',
      value: statusCounts.resolved || 0,
      description: 'Successfully resolved',
      icon: Shield,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-950',
    },
    {
      title: 'High Severity',
      value: analytics?.summary.highSeverity || 0,
      description: 'Critical incidents',
      icon: AlertTriangle,
      color: 'text-severity-high',
      bg: 'bg-red-100 dark:bg-red-950',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of disaster alerts and incidents</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WeatherCard />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest disaster reports from the network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts?.slice(0, 5).map((alert) => (
                <div key={alert._id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <img 
                    src={alert.imageUrl} 
                    alt={alert.type}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{alert.type}</p>
                      <div className="flex gap-1">
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
                          {alert.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location || 'Unknown location'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!alerts || alerts.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No alerts yet</p>
              )}
            </div>
            {alerts && alerts.length > 0 && (
              <Link 
                to="/alerts" 
                className="block text-center text-sm text-primary hover:underline mt-4"
              >
                View all alerts
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Most Common Type</span>
              </div>
              <span className="text-lg font-bold capitalize">{analytics?.summary.mostCommonType || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Top Location</span>
              </div>
              <span className="text-sm font-bold">{analytics?.summary.mostAffectedLocation || '—'}</span>
            </div>
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Top Alert Types</h4>
              <div className="space-y-2">
                {analytics?.typeDistribution.slice(0, 3).map((type, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type._id || type.type}</span>
                    <Badge variant="secondary">{type.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}