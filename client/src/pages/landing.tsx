import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useThemeStore } from '@/store/theme-store'
import { 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Zap, 
  TrendingUp, 
  Eye,
  ArrowRight,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react'

export function LandingPage() {
  const { theme } = useThemeStore()
  const previousTheme = theme

  // Force dark mode for landing page
  useEffect(() => {
    document.documentElement.classList.add('dark')
    
    return () => {
      // Restore user's theme when leaving landing page
      if (previousTheme === 'light') {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [previousTheme])
  const features = [
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Get instant notifications about disasters and emergencies in your area with precise location-based alerts.',
      color: 'text-severity-high'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'Visualize disaster zones, safe areas, and emergency resources with our dynamic mapping system.',
      color: 'text-info'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Access detailed analytics and insights about disaster patterns, trends, and historical data.',
      color: 'text-success'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Information',
      description: 'All alerts are verified by authorities ensuring you receive accurate and reliable information.',
      color: 'text-primary'
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'Lightning-fast alert delivery system ensures you receive critical information within seconds.',
      color: 'text-warning'
    },
    {
      icon: Eye,
      title: '24/7 Monitoring',
      description: 'Continuous monitoring of disaster-prone areas with automated detection and reporting systems.',
      color: 'text-severity-medium'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Alerts Delivered' },
    { value: '99.9%', label: 'Uptime' },
    { value: '<1s', label: 'Alert Delivery' }
  ]

  const steps = [
    {
      icon: Users,
      title: 'Create Account',
      description: 'Sign up in seconds and personalize your alert preferences'
    },
    {
      icon: MapPin,
      title: 'Set Location',
      description: 'Add your locations to receive targeted disaster alerts'
    },
    {
      icon: Bell,
      title: 'Stay Informed',
      description: 'Receive instant notifications and stay safe during emergencies'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-severity-high/10 p-2 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-severity-high" />
            </div>
            <span className="text-xl font-bold">UltraWatch</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="mb-4" variant="outline">
            <Zap className="h-3 w-3 mr-1" />
            Real-time disaster alerts powered by AI
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Stay Safe with
            <span className="block bg-gradient-to-r from-severity-high via-severity-medium to-warning bg-clip-text text-transparent mt-2">
              Instant Disaster Alerts
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced disaster monitoring and alert system that keeps you informed about emergencies, 
            natural disasters, and critical situations in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/register">
              <Button size="lg" className="text-base px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-12 border-t border-border/40 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Stay Safe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive disaster alert system with advanced features designed to keep you and your loved ones safe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-border/40 hover:border-border transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`${feature.color} bg-current/10 p-3 rounded-lg inline-flex mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who trust us to keep them safe during emergencies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/20" 
                 style={{ top: '3rem' }} />
            
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                      <div className="relative bg-primary text-primary-foreground p-4 rounded-full">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-background border-2 border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Trusted by Communities</h3>
                <p className="text-muted-foreground">Official disaster management partner</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-info/10 p-3 rounded-full">
                <Clock className="h-8 w-8 text-info" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">24/7 Availability</h3>
                <p className="text-muted-foreground">Always here when you need us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 md:p-16 text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Stay Protected?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of users who rely on our platform for critical disaster alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-severity-high/10 p-2 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-severity-high" />
              </div>
              <span className="font-semibold">UltraWatch</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 UltraWatch. Keeping communities safe.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
