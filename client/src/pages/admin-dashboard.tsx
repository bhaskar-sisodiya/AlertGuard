import { useAllUsers } from '@/hooks/use-admin'
import { useAnalyticsDashboard } from '@/hooks/use-analytics'
import { useAlerts } from '@/hooks/use-alerts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Shield, AlertTriangle, TrendingUp, Activity, MapPin, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { WeatherCard } from '@/components/weather-card'

export function AdminDashboardPage() {
  const { data: users, isLoading: usersLoading } = useAllUsers()
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsDashboard()
  const { data: alerts, isLoading: alertsLoading } = useAlerts()

  if (usersLoading || analyticsLoading || alertsLoading) {
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

  const roleCount = users?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const statusCounts = analytics?.statusKpi.reduce((acc, item) => {
    acc[item._id] = item.count
    return acc
  }, {} as Record<string, number>) || {}

  const stats = [
    {
      title: 'Total Users',
      value: users?.length || 0,
      description: `${roleCount.admin || 0} admins, ${roleCount.dma || 0} DMAs`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Active Alerts',
      value: analytics?.summary.totalAlerts || 0,
      description: `${statusCounts.no_action || 0} pending action`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      title: 'In Process',
      value: statusCounts.in_process || 0,
      description: 'Being handled',
      icon: Activity,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-950',
    },
    {
      title: 'Resolved',
      value: statusCounts.resolved || 0,
      description: 'Completed alerts',
      icon: Shield,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-950',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
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
            <CardTitle>Alert Status Distribution</CardTitle>
            <CardDescription>Current status of all alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">No Action</span>
              </div>
              <span className="text-2xl font-bold">{statusCounts.no_action || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">In Process</span>
              </div>
              <span className="text-2xl font-bold">{statusCounts.in_process || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Resolved</span>
              </div>
              <span className="text-2xl font-bold">{statusCounts.resolved || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DMA Assignment Stats</CardTitle>
            <CardDescription>Distribution of assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Assigned</span>
              </div>
              <span className="text-2xl font-bold">{analytics?.dmaAssignment.assignedCount || 0}</span>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Top DMAs</h4>
              {analytics?.dmaAssignment.perDma.slice(0, 3).map((dma, idx) => (
                <div key={dma.dmaId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                    <span className="text-sm">{dma.dma.username}</span>
                  </div>
                  <Badge variant="secondary">{dma.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
            <CardDescription>Breakdown by role type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(roleCount).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm capitalize font-medium">{role}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest reported incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts?.slice(0, 3).map((alert) => (
                <div key={alert._id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <img 
                    src={alert.imageUrl} 
                    alt={alert.type}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium capitalize">{alert.type}</p>
                      <Badge 
                        variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                        className={
                          alert.severity === 'medium'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200'
                            : alert.severity === 'low'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                            : ''
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/admin/alerts" 
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              View all alerts
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage system resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Manage Users</span>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              to="/admin/alerts"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Manage Alerts</span>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              to="/analytics"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">View Analytics</span>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
