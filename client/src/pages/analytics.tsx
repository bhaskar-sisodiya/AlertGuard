import { useAnalyticsDashboard } from '@/hooks/use-analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

const COLORS = {
  high: 'hsl(0, 84%, 60%)',
  medium: 'hsl(25, 95%, 53%)',
  low: 'hsl(45, 93%, 47%)',
}



export function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalyticsDashboard()

  // Transform data to ensure proper field names
  const typeDistribution = analytics?.typeDistribution?.map(item => ({
    type: item._id || item.type,
    count: item.count
  })) || []

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    )
  }

  const chartConfig = {
    count: {
      label: "Alerts",
      color: "hsl(220, 70%, 50%)",
    },
    high: {
      label: "High",
      color: COLORS.high,
    },
    medium: {
      label: "Medium",
      color: COLORS.medium,
    },
    low: {
      label: "Low",
      color: COLORS.low,
    },
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and trends</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alerts Over Time</CardTitle>
            <CardDescription>Overall trend of all alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={analytics?.alertsOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tickFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    } catch {
                      return value
                    }
                  }}
                />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--color-count)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-count)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Breakdown by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={analytics?.severityDistribution || []}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ severity, count }) => `${severity?.charAt(0).toUpperCase() + severity?.slice(1)}: ${count}`}
                >
                  {analytics?.severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.severity as keyof typeof COLORS] || COLORS.low} />
                  ))}
                </Pie>
                <Legend 
                  formatter={(value) => value?.charAt(0).toUpperCase() + value?.slice(1)}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert Types</CardTitle>
            <CardDescription>Distribution by incident type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={typeDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="type" 
                  className="text-xs"
                  tickFormatter={(value) => value?.charAt(0).toUpperCase() + value?.slice(1)}
                />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Most affected areas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={analytics?.topLocations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis 
                  type="category" 
                  dataKey="location" 
                  className="text-xs"
                  width={100}
                  tickFormatter={(value) => value?.length > 15 ? value.substring(0, 15) + '...' : value}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
