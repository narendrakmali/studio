# API Connection Guide - Frontend to Backend Database

This guide explains how to use the API connection layer to communicate between the frontend and backend database.

## Overview

The API connection layer consists of:
1. **API Routes** - Next.js API routes in `src/app/api/` that handle HTTP requests
2. **API Client** - Type-safe client library in `src/lib/api-client.ts`
3. **React Hooks** - Convenient hooks in `src/hooks/use-api.ts` for React components

## API Endpoints

### Transport Requests

#### List all requests
```typescript
GET /api/requests
Query params: ?status=pending&requestType=indoor
```

#### Get a specific request
```typescript
GET /api/requests/{id}
```

#### Create a new request
```typescript
POST /api/requests
Body: {
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
}
```

#### Update a request
```typescript
PATCH /api/requests/{id}
Body: { status: "completed", ... }
```

#### Delete a request
```typescript
DELETE /api/requests/{id}
```

### Vehicles

#### List all vehicles
```typescript
GET /api/vehicles
Query params: ?status=available&type=car
```

#### Register a new vehicle
```typescript
POST /api/vehicles
Body: {
  vehicleNumber: string;
  type: string;
  model: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicense?: string;
  currentLocation?: string;
  imageUrl?: string;
}
```

### Dispatch

#### List all dispatches
```typescript
GET /api/dispatch
Query params: ?status=dispatched&vehicleId=xxx
```

#### Create a dispatch (assign vehicle to request)
```typescript
POST /api/dispatch
Body: {
  requestId: string;
  vehicleId: string;
  estimatedArrival?: string;
  notes?: string;
  dispatchedBy?: string;
}
```

## Using the API Client

### Basic Usage

```typescript
import { apiClient } from '@/lib/api-client';

// Fetch all requests
const requests = await apiClient.getRequests();

// Fetch requests with filters
const pendingRequests = await apiClient.getRequests({ 
  status: 'pending' 
});

// Create a new request
const newRequest = await apiClient.createRequest({
  passengerName: "John Doe",
  department: "Engineering",
  purpose: "Meeting",
  pickupLocation: "Building A",
  dropLocation: "Building B",
  scheduledTime: new Date().toISOString(),
});

// Update a request
await apiClient.updateRequest('req_123', { 
  status: 'completed' 
});

// Fetch available vehicles
const vehicles = await apiClient.getVehicles({ 
  status: 'available' 
});

// Create a dispatch
await apiClient.createDispatch({
  requestId: 'req_123',
  vehicleId: 'veh_456',
});
```

### Error Handling

```typescript
import { apiClient, ApiError } from '@/lib/api-client';

try {
  const requests = await apiClient.getRequests();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message} (${error.statusCode})`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Using React Hooks

The hooks provide automatic loading and error states for your React components.

### Fetch Requests

```typescript
import { useRequests } from '@/hooks/use-api';

function RequestsList() {
  const { data, loading, error, refetch } = useRequests({ 
    status: 'pending' 
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(request => (
        <div key={request.id}>{request.passengerName}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Fetch Single Request

```typescript
import { useRequest } from '@/hooks/use-api';

function RequestDetail({ id }: { id: string }) {
  const { data, loading, error } = useRequest(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Not found</div>;

  return <div>{data.passengerName}</div>;
}
```

### Fetch Vehicles

```typescript
import { useVehicles } from '@/hooks/use-api';

function VehicleList() {
  const { data, loading, error } = useVehicles({ 
    status: 'available' 
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(vehicle => (
        <div key={vehicle.id}>
          {vehicle.vehicleNumber} - {vehicle.driverName}
        </div>
      ))}
    </div>
  );
}
```

### Create/Update Operations

```typescript
import { useMutation } from '@/hooks/use-api';
import { apiClient } from '@/lib/api-client';

function CreateRequestForm() {
  const { mutate, loading, error } = useMutation(
    apiClient.createRequest.bind(apiClient)
  );

  const handleSubmit = async (formData: any) => {
    const { data, error } = await mutate(formData);
    
    if (error) {
      alert('Failed to create request: ' + error);
    } else {
      alert('Request created successfully!');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit({
        passengerName: formData.get('name'),
        // ... other fields
      });
    }}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Request'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

## Complete Example: Request Dashboard

```typescript
'use client';
import { useRequests, useVehicles, useMutation } from '@/hooks/use-api';
import { apiClient } from '@/lib/api-client';

export default function Dashboard() {
  const { data: requests, loading: requestsLoading, refetch } = useRequests();
  const { data: vehicles } = useVehicles({ status: 'available' });
  
  const { mutate: createDispatch, loading: dispatchLoading } = useMutation(
    apiClient.createDispatch.bind(apiClient)
  );

  const handleAssignVehicle = async (requestId: string, vehicleId: string) => {
    const { error } = await createDispatch({ requestId, vehicleId });
    
    if (!error) {
      refetch(); // Refresh the requests list
      alert('Vehicle assigned successfully!');
    }
  };

  if (requestsLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Transport Requests</h1>
      {requests?.map(request => (
        <div key={request.id}>
          <h3>{request.passengerName}</h3>
          <p>{request.pickupLocation} → {request.dropLocation}</p>
          <p>Status: {request.status}</p>
          
          {request.status === 'pending' && (
            <select 
              onChange={(e) => handleAssignVehicle(request.id, e.target.value)}
              disabled={dispatchLoading}
            >
              <option value="">Assign Vehicle</option>
              {vehicles?.map(v => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} - {v.driverName}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Integration with Data Connect

The current implementation uses in-memory caching for development. To integrate with Firebase Data Connect:

1. **Import Data Connect SDK**:
```typescript
import { executeQuery, executeMutation } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { 
  ListTransportRequests, 
  CreateTransportRequest 
} from '@dataconnect/generated';
```

2. **Replace API route implementation**:
```typescript
// In src/app/api/requests/route.ts
export async function GET() {
  const { data } = await executeQuery(connectorConfig, ListTransportRequests);
  return NextResponse.json({ success: true, data: data.transportRequests });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data } = await executeMutation(
    connectorConfig, 
    CreateTransportRequest, 
    body
  );
  return NextResponse.json({ success: true, data });
}
```

## Testing the Connection

```bash
# Start the development server
npm run dev

# Test the API endpoints
curl http://localhost:9002/api/test-connection
curl http://localhost:9002/api/requests
curl http://localhost:9002/api/vehicles
```

## Environment Variables

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Next Steps

1. Replace in-memory cache with actual Data Connect calls
2. Add authentication middleware to API routes
3. Add request validation with Zod schemas
4. Implement real-time updates with Firestore listeners
5. Add rate limiting and caching for production
