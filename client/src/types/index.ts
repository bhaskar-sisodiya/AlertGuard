export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  location?: string;
  locationKey?: string;
  role: 'admin' | 'dma' | 'operator' | 'user';
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  _id: string;
  type: string;
  imageUrl: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  reason?: string;
  location?: string;
  lat: number;
  lng: number;
  status: 'no_action' | 'in_process' | 'resolved';
  statusUpdatedBy?: {
    _id: string;
    username: string;
    email: string;
  };
  statusUpdatedAt?: string;
  assignedDma?: {
    _id: string;
    username: string;
    email: string;
  };
  assignedBy?: {
    _id: string;
    username: string;
    email: string;
  };
  assignedAt?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  description?: string;
  isNational: boolean;
}

export interface EmergencyNumber {
  _id: string;
  category: 
    | 'Universal'
    | 'Police'
    | 'Medical'
    | 'Fire'
    | 'Women & Children'
    | 'Cyber & Financial Fraud'
    | 'Utilities'
    | 'Animal & Environment'
    | 'International';
  numbers: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    precip_mm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    uv: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
      };
    }>;
  };
}

export interface AnalyticsSummary {
  totalAlerts: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
}

export interface AlertsOverTime {
  date: string;
  count: number;
}

export interface TypeDistribution {
  _id?: string;
  type: string;
  count: number;
}

export interface SeverityDistribution {
  severity: string;
  count: number;
}

export interface StatusKpi {
  _id: string;
  count: number;
}

export interface DmaAssignment {
  assignedCount: number;
  perDma: Array<{
    dmaId: string;
    count: number;
    dma: {
      username: string;
      email: string;
      location?: string;
      phone?: string;
    };
  }>;
}

export interface SeverityByType {
  type: string;
  high: number;
  medium: number;
  low: number;
}

export interface TopLocation {
  location: string;
  count: number;
}

export interface ConfidenceBucket {
  _id: number;
  count: number;
}

export interface AnalyticsDashboard {
  range: string;
  summary: {
    totalAlerts: number;
    highSeverity: number;
    mostCommonType: string;
    mostAffectedLocation: string;
    avgConfidence: number | null;
  };
  alertsOverTime: AlertsOverTime[];
  typeDistribution: TypeDistribution[];
  severityDistribution: SeverityDistribution[];
  severityByType: any[];
  topLocations: TopLocation[];
  confidenceBuckets: ConfidenceBucket[];
  statusKpi: StatusKpi[];
  dmaAssignment: DmaAssignment;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface PaginatedAlerts {
  alerts: Alert[];
  page: number;
  totalPages: number;
  totalAlerts: number;
  limit: number;
}
