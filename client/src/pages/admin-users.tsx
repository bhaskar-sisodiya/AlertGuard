import { useState } from 'react'
import { useAllUsers, useUpdateUserRole } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Search, Shield, Mail, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '@/types'

const ROLES = ['user', 'operator', 'dma', 'admin'] as const

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
    case 'dma':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
    case 'operator':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200'
  }
}

export function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsers()
  const updateRole = useUpdateUserRole()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const filteredUsers = users?.filter((user) => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleRoleUpdate = async (userId: string, newRole: string, currentUser: User) => {
    try {
      await updateRole.mutateAsync({ userId, role: newRole })
      toast.success(`Updated ${currentUser.username}'s role to ${newRole}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {users?.length || 0} Users
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role} className="capitalize">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredUsers?.map((user) => (
          <Card key={user._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{user.username}</h3>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(newRole) => handleRoleUpdate(user._id, newRole, user)}
                    disabled={updateRole.isPending}
                  >
                    <SelectTrigger className="w-[140px]">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="capitalize">
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!filteredUsers || filteredUsers.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No users found</p>
            <p className="text-sm text-muted-foreground">
              {search || roleFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No users in the system yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
