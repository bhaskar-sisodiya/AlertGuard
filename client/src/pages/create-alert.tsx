import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateAlert } from '@/hooks/use-alerts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, MapPin, Camera, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateAlertPage() {
  const navigate = useNavigate()
  const createAlert = useCreateAlert()
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium')
  const [location, setLocation] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      })
      setStream(mediaStream)
      setShowCamera(true)
      
      // Wait for dialog to render, then set video stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (error) {
      toast.error('Failed to access camera. Please check permissions.')
      console.error('Camera error:', error)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
            setImageFile(file)
            setImagePreview(canvas.toDataURL('image/jpeg'))
            stopCamera()
            toast.success('Photo captured')
          }
        }, 'image/jpeg', 0.95)
      }
    }
  }

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString())
          setLng(position.coords.longitude.toString())
          toast.success('Location captured')
        },
        (error) => {
          toast.error('Failed to get location: ' + error.message)
        }
      )
    } else {
      toast.error('Geolocation is not supported')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) {
      toast.error('Please select an image')
      return
    }

    if (!lat || !lng) {
      toast.error('Please provide location coordinates')
      return
    }

    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('severity', severity)
    formData.append('location', location)
    formData.append('lat', lat)
    formData.append('lng', lng)

    try {
      await createAlert.mutateAsync(formData)
      toast.success('Alert created successfully')
      navigate('/alerts')
    } catch (error) {
      toast.error('Failed to create alert')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Alert</h1>
        <p className="text-muted-foreground">Report a disaster or emergency incident</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alert Details</CardTitle>
          <CardDescription>
            Provide information about the incident. AI will analyze the image to determine the type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Incident Image *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview('')
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={startCamera}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level *</Label>
              <Select value={severity} onValueChange={(value: 'low' | 'medium' | 'high') => setSeverity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Monitor situation</SelectItem>
                  <SelectItem value="medium">Medium - Requires attention</SelectItem>
                  <SelectItem value="high">High - Critical incident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Description</Label>
              <Input
                id="location"
                placeholder="e.g., Downtown, 5th Avenue"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude *</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="40.7128"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude *</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="-74.0060"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Use Current Location
            </Button>

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/alerts')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createAlert.isPending}
                className="flex-1"
              >
                {createAlert.isPending ? 'Creating...' : 'Create Alert'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Take Photo</DialogTitle>
            <DialogDescription>
              Position the camera to capture the incident
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
              <Button onClick={capturePhoto}>
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}