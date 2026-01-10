# API Quick Reference

## 🚀 Quick Start

### 1. In a React Component (Recommended)

```typescript
import { useRequests, useMutation } from '@/hooks/use-api';
import { apiClient } from '@/lib/api-client';

function MyComponent() {
  // Fetch data with automatic loading states
  const { data, loading, error, refetch } = useRequests();
  
  // Create/update operations
  const { mutate, loading: saving } = useMutation(
    apiClient.createRequest.bind(apiClient)
  );
  
  const handleCreate = async () => {
    const { data, error } = await mutate({
      passengerName: "John",
      // ... other fields
    });
  };
}
```

### 2. Direct API Calls

```typescript
import { apiClient } from '@/lib/api-client';

// Anywhere in your app
const requests = await apiClient.getRequests();
const newRequest = await apiClient.createRequest({...});
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests` | List all requests |
| GET | `/api/requests/:id` | Get single request |
| POST | `/api/requests` | Create request |
| PATCH | `/api/requests/:id` | Update request |
| DELETE | `/api/requests/:id` | Delete request |
| GET | `/api/vehicles` | List all vehicles |
| POST | `/api/vehicles` | Register vehicle |
| GET | `/api/dispatch` | List dispatches |
| POST | `/api/dispatch` | Create dispatch |
| GET | `/api/test-connection` | Test connection |

## 🎣 Available Hooks

```typescript
// Fetch requests
const { data, loading, error, refetch } = useRequests({ 
  status: 'pending' 
});

// Fetch single request
const { data, loading, error } = useRequest(id);

// Fetch vehicles
const { data, loading, error } = useVehicles({ 
  status: 'available' 
});

// Fetch dispatches
const { data, loading, error } = useDispatches();

// Mutations
const { mutate, loading, error } = useMutation(apiFunction);
```

## 📝 Common Patterns

### Create a Request
```typescript
const { mutate, loading } = useMutation(apiClient.createRequest.bind(apiClient));

await mutate({
  passengerName: "John Doe",
  department: "Engineering",
  purpose: "Meeting",
  pickupLocation: "Building A",
  dropLocation: "Building B",
  scheduledTime: new Date().toISOString(),
});
```

### Update Request Status
```typescript
await apiClient.updateRequest('req_123', { 
  status: 'completed' 
});
```

### Assign Vehicle
```typescript
await apiClient.createDispatch({
  requestId: 'req_123',
  vehicleId: 'veh_456',
});
```

### Filter Requests
```typescript
const { data } = useRequests({ 
  status: 'pending',
  requestType: 'outdoor' 
});
```

## 🔍 Error Handling

```typescript
import { ApiError } from '@/lib/api-client';

try {
  await apiClient.getRequests();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message, error.statusCode);
  }
}
```

## 🧪 Testing

```bash
# View example page
npm run dev
# Visit http://localhost:9002/api-example

# Run API tests
./scripts/test-api.sh

# Test individual endpoint
curl http://localhost:9002/api/requests
```

## 🔗 Files

- API Routes: `src/app/api/*/route.ts`
- Client: `src/lib/api-client.ts`
- Hooks: `src/hooks/use-api.ts`
- Example: `src/app/api-example/page.tsx`
- Guide: `API_CONNECTION_GUIDE.md`
