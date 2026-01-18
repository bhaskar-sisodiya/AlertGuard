import { useState, useEffect, useRef } from 'react'
import { useUserProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/use-user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Camera } from 'lucide-react'
import { toast } from 'sonner'

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

export function ProfilePage() {
  const { data: user, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Prefer not to say')
  const [location, setLocation] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string>('')

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
      setPhone(user.phone || '')
      setGender(user.gender || 'Prefer not to say')
      setLocation(user.location || '')
      setAvatarPreview(getAvatarUrl(user.avatar, user.gender))
    }
  }, [user])

  useEffect(() => {
    // Update avatar preview when gender changes
    if (user && (!user.avatar || user.avatar === 'default' || user.avatar === 'male' || user.avatar === 'female')) {
      setAvatarPreview(getAvatarUrl(user.avatar, gender))
    }
  }, [gender, user])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      const response = await uploadAvatar.mutateAsync(file)
      // Update preview with the uploaded URL
      if (response.user.avatar) {
        setAvatarPreview(response.user.avatar)
      }
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to upload avatar')
      setAvatarPreview(getAvatarUrl(user?.avatar, gender))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync({ username, phone, gender, location })
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={avatarPreview} alt={user?.username} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                aria-label="Change avatar"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <CardTitle>{user?.username}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
              <p className="text-xs text-muted-foreground mt-1">Click avatar to upload custom image</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select key={gender} value={gender} onValueChange={(value: typeof gender) => setGender(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={updateProfile.isPending}
              className="w-full"
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}