/**
 * API Client for frontend-backend communication
 * Provides type-safe methods to interact with the backend API
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use relative URLs in production, can be overridden for development
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error || 'An error occurred',
        response.status,
        data
      );
    }

    return data.data as T;
  }

  // Transport Requests API
  async getRequests(filters?: {
    status?: string;
    requestType?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.requestType) params.append('requestType', filters.requestType);
    
    const query = params.toString();
    return this.request<any[]>(`/requests${query ? `?${query}` : ''}`);
  }

  async getRequestById(id: string) {
    return this.request<any>(`/requests/${id}`);
  }

  async createRequest(data: {
    passengerName: string;
    department: string;
    purpose: string;
    phoneNumber?: string;
    employeeId?: string;
    pickupLocation: string;
    dropLocation: string;
    scheduledTime: string;
    priority?: string;
    specialRequirements?: string;
    numberOfPassengers?: number;
    estimatedDistance?: number;
    requestType?: string;
  }) {
    return this.request<any>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRequest(id: string, data: Partial<any>) {
    return this.request<any>(`/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteRequest(id: string) {
    return this.request<{ message: string }>(`/requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Vehicles API
  async getVehicles(filters?: {
    status?: string;
    type?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    
    const query = params.toString();
    return this.request<any[]>(`/vehicles${query ? `?${query}` : ''}`);
  }

  async registerVehicle(data: {
    vehicleNumber: string;
    type: string;
    model: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    driverLicense?: string;
    currentLocation?: string;
    imageUrl?: string;
  }) {
    return this.request<any>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dispatch API
  async getDispatches(filters?: {
    status?: string;
    vehicleId?: string;
    requestId?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters?.requestId) params.append('requestId', filters.requestId);
    
    const query = params.toString();
    return this.request<any[]>(`/dispatch${query ? `?${query}` : ''}`);
  }

  async createDispatch(data: {
    requestId: string;
    vehicleId: string;
    estimatedArrival?: string;
    notes?: string;
    dispatchedBy?: string;
  }) {
    return this.request<any>('/dispatch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async testConnection() {
    return this.request<any>('/test-connection');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for testing or custom instances
export default ApiClient;
