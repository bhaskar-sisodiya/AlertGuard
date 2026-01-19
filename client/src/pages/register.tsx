import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  Clock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react'

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const register = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate({ username, email, password })
  }

  const benefits = [
    { icon: Zap, text: 'Instant disaster notifications' },
    { icon: Users, text: 'Community-driven alerts' },
    { icon: Clock, text: '24/7 monitoring system' }
  ]

  const passwordRequirements = [
    { met: password.length >= 6, text: 'At least 6 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' }
  ]

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-success via-success/90 to-success/80 p-12 text-primary-foreground relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to home</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary-foreground/10 p-3 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">UltraWatch</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Join the safety network
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Create your free account and get instant access to real-time disaster alerts and emergency notifications.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-center gap-3 text-primary-foreground/90">
                  <div className="bg-primary-foreground/10 p-2 rounded-lg backdrop-blur-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{benefit.text}</span>
                </div>
              )
            })}
          </div>

          <div className="pt-6 border-t border-primary-foreground/20">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Free forever • No credit card required</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to home</span>
            </Link>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-success/10 p-2 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
              <span className="text-xl font-bold">UltraWatch</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground">
              Get started with your free account in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {register.isError && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <div className="flex-1">
                  {register.error?.message || 'Registration failed. Please try again.'}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {password && (
                  <div className="space-y-2 pt-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle 
                          className={`h-3.5 w-3.5 ${
                            req.met ? 'text-success' : 'text-muted-foreground/50'
                          }`}
                        />
                        <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <Link 
                to="/login" 
                className="text-primary font-medium hover:underline"
              >
                Sign in to your account
              </Link>
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
