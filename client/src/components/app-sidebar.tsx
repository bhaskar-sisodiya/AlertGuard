import { Link, useLocation } from 'react-router-dom'
import { useLogout } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth-store'
import { useUserProfile } from '@/hooks/use-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  Phone, 
  User, 
  LogOut,
  ChevronUp,
  Plus,
  Shield,
  Users
} from 'lucide-react'

// Default avatar URLs
const DEFAULT_AVATARS = {
  male: 'https://images.unsplash.com/photo-1680540692052-79fde1108370?w=400',
  female: 'https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg?w=400',
}

const getAvatarUrl = (avatar: string | undefined, gender: string | undefined): string => {
  if (!avatar || avatar === 'default') {
    if (gender === 'Male') return DEFAULT_AVATARS.male
    if (gender === 'Female') return DEFAULT_AVATARS.female
    return ''
  }
  
  if (avatar === 'male') return DEFAULT_AVATARS.male
  if (avatar === 'female') return DEFAULT_AVATARS.female
  
  // Custom uploaded avatar URL
  return avatar
}

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard', roles: ['admin', 'dma', 'operator', 'user'] },
  { title: 'Alerts', icon: AlertTriangle, url: '/alerts', roles: ['admin', 'dma', 'operator', 'user'] },
  { title: 'Map View', icon: MapPin, url: '/map', roles: ['admin', 'dma', 'operator', 'user'] },
  { title: 'Analytics', icon: BarChart3, url: '/analytics', roles: ['admin', 'dma', 'operator', 'user'] },
  { title: 'Emergency Numbers', icon: Phone, url: '/emergency', roles: ['admin', 'dma', 'operator', 'user'] },
]

const adminMenuItems = [
  { title: 'Admin Dashboard', icon: Shield, url: '/admin/dashboard' },
  { title: 'Manage Users', icon: Users, url: '/admin/users' },
  { title: 'Manage Alerts', icon: AlertTriangle, url: '/admin/alerts' },
]

export function AppSidebar() {
  const location = useLocation()
  const logout = useLogout()
  const user = useAuthStore((state) => state.user)
  const { data: userProfile } = useUserProfile()
  
  // Use fresh profile data if available, otherwise fall back to store
  const displayUser = userProfile || user
  const avatarUrl = getAvatarUrl(displayUser?.avatar, displayUser?.gender)

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-severity-high/10 text-severity-high">
                  <AlertTriangle className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">UltraWatch</span>
                  <span className="truncate text-xs text-muted-foreground">Disaster Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => item.roles.includes(displayUser?.role || 'user'))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {displayUser?.role?.toLowerCase() === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/alerts/create">
                    <Plus />
                    <span>Create Alert</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatarUrl} alt={displayUser?.username} />
                    <AvatarFallback className="rounded-lg">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{displayUser?.username}</span>
                    <span className="truncate text-xs text-muted-foreground">{displayUser?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}