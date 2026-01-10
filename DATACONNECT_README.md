# 🔥 Firebase Data Connect - Studio Transport System

**Firestore has been completely replaced with Firebase Data Connect**

## 🎯 Quick Start

```bash
# Option 1: Use the quick start script
./quickstart.sh

# Option 2: Manual start
firebase emulators:start --only dataconnect  # Terminal 1
npm run dev                                   # Terminal 2
```

## 📋 What is Data Connect?

Firebase Data Connect is a **Cloud SQL-backed database** with:
- ✅ **Type-safe SDK** - Auto-generated TypeScript
- ✅ **GraphQL Schema** - Structured data modeling
- ✅ **Better Performance** - SQL backend
- ✅ **Relationships** - Native foreign keys
- ✅ **Real Queries** - Complex joins & aggregations

## 📁 Project Structure

```
dataconnect/
├── schema/
│   └── schema.gql              # Database schema (tables)
├── example/
│   ├── queries.gql             # Query operations
│   └── mutations.gql           # Create/Update/Delete operations
└── dataconnect.yaml            # Configuration

src/
├── dataconnect-generated/      # ✨ Auto-generated SDK
│   ├── index.d.ts             # TypeScript types
│   ├── README.md              # SDK documentation
│   └── react/                 # React hooks
└── lib/
    ├── dataconnect-examples.ts # Usage examples
    └── data.ts                # (No longer uses Firestore)
```

## 🗄️ Database Schema

### TransportRequest
```typescript
{
  id: UUID
  passengerName: string
  department: string
  purpose: string
  pickupLocation: string
  dropLocation: string
  scheduledTime: Date
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assignedVehicleId?: UUID
  // ... more fields
}
```

### Vehicle
```typescript
{
  id: UUID
  vehicleNumber: string
  type: string
  model: string
  capacity: number
  driverName: string
  driverPhone: string
  status: 'available' | 'in_use' | 'maintenance' | 'offline'
  // ... more fields
}
```

### Dispatch
```typescript
{
  id: UUID
  requestId: UUID
  vehicleId: UUID
  dispatchedAt: Date
  estimatedArrival?: Date
  actualArrival?: Date
  completedAt?: Date
  status: 'dispatched' | 'en_route' | 'arrived' | 'completed' | 'cancelled'
  // ... more fields
}
```

## 💻 Usage Examples

### Create a Transport Request

```typescript
import { createTransportRequest } from '@dataconnect/generated';

const result = await createTransportRequest({
  passengerName: 'John Doe',
  department: 'Engineering',
  purpose: 'Client Meeting',
  phoneNumber: '+1234567890',
  pickupLocation: 'Building A, Floor 3',
  dropLocation: 'Downtown Conference Center',
  scheduledTime: new Date('2026-01-08T10:00:00'),
  priority: 'high',
  requestType: 'outdoor',
  numberOfPassengers: 2,
});

// Access the created request
console.log('Created:', result.data.transportRequest_insert);
```

### List All Requests

```typescript
import { listTransportRequests } from '@dataconnect/generated';

const result = await listTransportRequests();
const requests = result.data.transportRequests;

// Each request has full type safety!
requests.forEach(req => {
  console.log(`${req.passengerName} - ${req.status}`);
  if (req.assignedVehicle) {
    console.log(`Assigned to: ${req.assignedVehicle.vehicleNumber}`);
  }
});
```

### Register a Vehicle

```typescript
import { registerVehicle } from '@dataconnect/generated';

const result = await registerVehicle({
  vehicleNumber: 'KA-01-AB-1234',
  type: 'sedan',
  model: 'Toyota Camry',
  capacity: 4,
  driverName: 'Rajesh Kumar',
  driverPhone: '+919876543210',
  driverLicense: 'KA0120230012345',
  currentLocation: 'Main Garage',
});
```

### Assign Vehicle & Create Dispatch

```typescript
import { 
  assignVehicleToRequest,
  updateTransportRequestStatus,
  updateVehicleStatus,
  createDispatch,
} from '@dataconnect/generated';

// Assign vehicle to request
await assignVehicleToRequest({
  requestId: '123e4567-e89b-12d3-a456-426614174000',
  vehicleId: '987fcdeb-51a2-43d8-b789-012345678900',
});

// Update statuses
await updateTransportRequestStatus({
  id: requestId,
  status: 'assigned',
});

await updateVehicleStatus({
  id: vehicleId,
  status: 'in_use',
});

// Create dispatch record
await createDispatch({
  requestId,
  vehicleId,
  estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
  notes: 'Driver en route',
  dispatchedBy: 'dispatcher@example.com',
});
```

## ⚛️ React Usage

### Simple Polling

```typescript
import { useState, useEffect } from 'react';
import { listTransportRequests } from '@dataconnect/generated';

function RequestsComponent() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const result = await listTransportRequests();
      setRequests(result.data.transportRequests);
      setLoading(false);
    };

    fetchRequests();
    
    // Poll every 2 seconds
    const interval = setInterval(fetchRequests, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {requests.map(req => (
        <div key={req.id}>{req.passengerName}</div>
      ))}
    </div>
  );
}
```

### With React Query (Recommended)

```typescript
import { useQuery } from '@tanstack/react-query';
import { listTransportRequests } from '@dataconnect/generated';

function RequestsComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transportRequests'],
    queryFn: async () => {
      const result = await listTransportRequests();
      return result.data.transportRequests;
    },
    refetchInterval: 2000, // Auto-refresh
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map(req => (
        <div key={req.id}>{req.passengerName}</div>
      ))}
    </div>
  );
}
```

## 🛠️ Available Operations

### Queries
- `listTransportRequests()` - Get all requests
- `getTransportRequestById({ id })` - Get specific request
- `listVehicles()` - Get all vehicles
- `getAvailableVehicles()` - Get only available vehicles
- `getVehicleById({ id })` - Get specific vehicle
- `listDispatches()` - Get all dispatches

### Mutations
- `createTransportRequest({ ...data })` - Create request
- `updateTransportRequestStatus({ id, status })` - Update status
- `assignVehicleToRequest({ requestId, vehicleId })` - Assign vehicle
- `registerVehicle({ ...data })` - Register vehicle
- `updateVehicleStatus({ id, status })` - Update vehicle status
- `updateVehicleLocation({ id, currentLocation })` - Update location
- `createDispatch({ ...data })` - Create dispatch
- `updateDispatchStatus({ ...data })` - Update dispatch
- `deleteTransportRequest({ id })` - Delete request

## 🔄 Development Workflow

### 1. Modify Schema

Edit `dataconnect/schema/schema.gql`:
```graphql
type TransportRequest @table {
  # Add new field
  estimatedCost: Float
}
```

### 2. Add Queries/Mutations

Edit `dataconnect/example/queries.gql` or `mutations.gql`

### 3. Regenerate SDK

```bash
firebase dataconnect:sdk:generate
```

### 4. Use in Code

```typescript
// TypeScript will now know about the new field!
import { listTransportRequests } from '@dataconnect/generated';

const result = await listTransportRequests();
console.log(result.data.transportRequests[0].estimatedCost);
```

## 🚀 Deployment

### Local Development
```bash
firebase emulators:start --only dataconnect
```

### Production
```bash
# Deploy schema to Cloud SQL
firebase deploy --only dataconnect

# Deploy your app
npm run build
npm run start
```

## 📚 Resources

- **Migration Guide**: [FIRESTORE_TO_DATACONNECT_MIGRATION.md](FIRESTORE_TO_DATACONNECT_MIGRATION.md)
- **Complete Summary**: [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)
- **Code Examples**: [src/lib/dataconnect-examples.ts](src/lib/dataconnect-examples.ts)
- **Generated SDK Docs**: [src/dataconnect-generated/README.md](src/dataconnect-generated/README.md)
- **Firebase Docs**: https://firebase.google.com/docs/data-connect

## ❓ FAQ

**Q: Where did Firestore go?**  
A: Completely removed! Data Connect is your new database.

**Q: How do I query data?**  
A: Use the generated functions from `@dataconnect/generated`

**Q: Can I use real-time updates?**  
A: Yes! Use polling (shown above) or Data Connect live queries.

**Q: What about Auth?**  
A: Firebase Auth still works perfectly! Only the database changed.

**Q: How do I see my data?**  
A: Use the Firebase Emulator UI at http://localhost:4000

---

**Ready to migrate your pages?** Check [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for step-by-step instructions!
