import { useEmergencyNumbers } from '@/hooks/use-emergency'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Phone, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function EmergencyPage() {
  const { data: emergencyNumbers, isLoading } = useEmergencyNumbers()

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number)
    toast.success('Number copied to clipboard')
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergency Numbers</h1>
        <p className="text-muted-foreground">Quick access to emergency contacts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {emergencyNumbers?.map((category) => (
          <Card key={category._id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                {category.category}
              </CardTitle>
              <CardDescription>
                {category.numbers.length} contact{category.numbers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.numbers.map((contact, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{contact.name}</p>
                        {contact.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {contact.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(contact.number)}
                        className="shrink-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <a 
                      href={`tel:${contact.number}`}
                      className="text-lg font-semibold text-primary hover:underline block"
                    >
                      {contact.number}
                    </a>
                    {contact.isNational && (
                      <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-2">
                        National
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {(!emergencyNumbers || emergencyNumbers.length === 0) && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No emergency numbers available</p>
              <p className="text-sm text-muted-foreground">Contact your administrator to add emergency contacts</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}