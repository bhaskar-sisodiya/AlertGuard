import { useState } from 'react'
import { useAlertsHistory, useDeleteAlert } from '@/hooks/use-alerts'
import { useUpdateAlertStatus, useAssignDma, useAllUsers } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, MapPin, Clock, Trash2, Search, User, Shield } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export function AdminAlertsPage() {
  const { data: alerts, isLoading } = useAlertsHistory()
  const { data: users } = useAllUsers()
  const deleteAlert = useDeleteAlert()
  const updateStatus = useUpdateAlertStatus()
  const assignDma = useAssignDma()
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const dmaUsers = users?.filter(u => u.role === 'dma' || u.role === 'admin')

  const filteredAlerts = alerts?.filter((alert) => {
    if (!alert || !alert.type) return false
    const matchesSearch = 
      alert.type?.toLowerCase().includes(search.toLowerCase()) ||
      alert.location?.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteAlert.mutate(id)
    }
  }

  const handleStatusUpdate = async (alertId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ alertId, status })
      toast.success('Alert status updated')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const handleAssignDma = async (alertId: string, dmaUserId: string) => {
    try {
      await assignDma.mutateAsync({ alertId, dmaUserId })
      toast.success('DMA assigned successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign DMA')
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      case 'in_process':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Alerts</h1>
          <p className="text-muted-foreground">Review and manage all disaster alerts</p>
        </div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="no_action">No Action</SelectItem>
                <SelectItem value="in_process">In Process</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
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
              <Badge className={getStatusBadge(alert.status)}>
                {getStatusLabel(alert.status)}
              </Badge>
              <CardDescription className="space-y-1 mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {alert.location || 'Unknown location'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(alert.timestamp)}
                </div>
                {alert.assignedDma && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Assigned to: {alert.assignedDma.username}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alert.reason && (
                <p className="text-sm text-muted-foreground">{alert.reason}</p>
              )}
              <div className="space-y-2">
                <Select
                  value={alert.status}
                  onValueChange={(status) => handleStatusUpdate(alert._id, status)}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_action">No Action</SelectItem>
                    <SelectItem value="in_process">In Process</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={alert.assignedDma?._id || ''}
                  onValueChange={(dmaId) => handleAssignDma(alert._id, dmaId)}
                  disabled={assignDma.isPending}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <SelectValue placeholder="Assign DMA" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {dmaUsers?.map((dma) => (
                      <SelectItem key={dma._id} value={dma._id}>
                        {dma.username} ({dma.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Confidence: {Math.round(alert.confidence * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(alert._id)}
                  disabled={deleteAlert.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
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
            <p className="text-sm text-muted-foreground">
              {search || severityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No alerts in the system yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
