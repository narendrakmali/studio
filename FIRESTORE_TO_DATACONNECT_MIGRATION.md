# Migration Guide: Firestore → Firebase Data Connect

## Overview
This guide helps you complete the migration from Firestore to Firebase Data Connect for the Studio Transport Management System.

## ✅ What's Been Done

1. **Schema Created** - Complete Data Connect schema defined in `dataconnect/schema/schema.gql`
2. **Queries & Mutations** - All CRUD operations defined in `dataconnect/example/` 
3. **Firebase Provider Updated** - Firestore dependency removed from provider
4. **Data Layer Prepared** - `src/lib/data.ts` ready for Data Connect integration

## 🔧 Steps to Complete Migration

### Step 1: Generate Data Connect SDK

```bash
# From project root
firebase dataconnect:sdk:generate

# Or if using emulator
firebase emulators:start --only dataconnect
```

This generates the TypeScript SDK in `src/dataconnect-generated/`

### Step 2: Deploy Data Connect Schema

```bash
# Deploy to Firebase project
firebase deploy --only dataconnect

# Or use emulator for local development
firebase emulators:start
```

### Step 3: Update Pages to Use Data Connect

Replace Firestore imports with Data Connect SDK imports. Here are examples:

#### Example: Indoor Request Page

**Before (Firestore):**
```tsx
import { addRequest } from "@/lib/data";
import { useFirebase } from "@/firebase/provider";

// In component
const { firestore } = useFirebase();

// Submit handler
await addRequest({
  passengerName: data.name,
  department: data.department,
  // ...
});
```

**After (Data Connect):**
```tsx
import { createTransportRequest } from '@dataconnect/generated';

// Submit handler - no need for useFirebase
const result = await createTransportRequest({
  passengerName: data.name,
  department: data.department,
  purpose: data.purpose,
  phoneNumber: data.phone,
  employeeId: data.employeeId,
  pickupLocation: data.pickup,
  dropLocation: data.destination,
  scheduledTime: new Date(data.pickupTime),
  requestType: 'indoor',
  numberOfPassengers: 1,
  priority: 'normal'
});

console.log('Request created:', result.data.transportRequest_insert);
```

#### Example: Dashboard Page (Listing Requests)

**Before (Firestore):**
```tsx
import { initializeRequestsListener, requests } from "@/lib/data";
import { useFirebase } from "@/firebase/provider";

useEffect(() => {
  const { firestore } = useFirebase();
  if (firestore) {
    initializeRequestsListener();
  }
}, [firestore]);
```

**After (Data Connect):**
```tsx
import { listTransportRequests } from '@dataconnect/generated';
import { useState, useEffect } from 'react';

const [requests, setRequests] = useState([]);

useEffect(() => {
  const fetchRequests = async () => {
    const result = await listTransportRequests();
    setRequests(result.data.transportRequests);
  };
  
  fetchRequests();
  
  // Poll every 2 seconds for updates (or use live queries)
  const interval = setInterval(fetchRequests, 2000);
  return () => clearInterval(interval);
}, []);
```

#### Example: Fleet Registration

**Before (Firestore):**
```tsx
import { collection, addDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";

const { firestore } = useFirebase();

await addDoc(collection(firestore, "vehicles"), {
  vehicleNumber: data.vehicleNumber,
  // ...
});
```

**After (Data Connect):**
```tsx
import { registerVehicle } from '@dataconnect/generated';

const result = await registerVehicle({
  vehicleNumber: data.vehicleNumber,
  type: data.type,
  model: data.model,
  capacity: parseInt(data.capacity),
  driverName: data.driverName,
  driverPhone: data.driverPhone,
  driverLicense: data.licenseNumber,
  imageUrl: uploadedImageUrl,
  currentLocation: 'Garage'
});
```

### Step 4: Real-time Updates with Data Connect

Data Connect supports live queries for real-time updates:

```tsx
import { useQuery } from '@dataconnect/generated/react';
import { listTransportRequests } from '@dataconnect/generated';

// Using the React hook (requires TanStack Query provider)
function DashboardComponent() {
  const { data, isLoading, error } = useQuery(listTransportRequests, {
    refetchInterval: 2000, // Poll every 2 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.transportRequests.map(request => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}
```

### Step 5: Update Specific Pages

Files that need updating:

1. **[src/app/indoor-request/page.tsx](src/app/indoor-request/page.tsx)** - Replace `addRequest` with `createTransportRequest`
2. **[src/app/outdoor-request/page.tsx](src/app/outdoor-request/page.tsx)** - Replace `addRequest` with `createTransportRequest`
3. **[src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)** - Replace Firestore listener with `listTransportRequests`
4. **[src/app/reception/page.tsx](src/app/reception/page.tsx)** - Replace Firestore vehicle registration with `registerVehicle`
5. **[src/app/dispatch/page.tsx](src/app/dispatch/page.tsx)** - Use `assignVehicleToRequest` and `createDispatch`
6. **[src/app/fleet/page.tsx](src/app/fleet/page.tsx)** - Use `listVehicles` and `getAvailableVehicles`

## 📝 Available Data Connect Operations

### Transport Requests
- `listTransportRequests()` - Get all requests
- `getTransportRequestById({ id })` - Get specific request
- `createTransportRequest({ ...data })` - Create new request
- `updateTransportRequestStatus({ id, status })` - Update status
- `assignVehicleToRequest({ requestId, vehicleId })` - Assign vehicle
- `deleteTransportRequest({ id })` - Delete request

### Vehicles
- `listVehicles()` - Get all vehicles
- `getAvailableVehicles()` - Get only available vehicles
- `getVehicleById({ id })` - Get specific vehicle
- `registerVehicle({ ...data })` - Register new vehicle
- `updateVehicleStatus({ id, status })` - Update vehicle status
- `updateVehicleLocation({ id, currentLocation })` - Update location

### Dispatches
- `listDispatches()` - Get all dispatches
- `createDispatch({ ...data })` - Create new dispatch
- `updateDispatchStatus({ ...data })` - Update dispatch status

## 🗑️ Safe to Remove

After migration is complete, you can safely remove:

1. **Firestore hooks:**
   - `src/firebase/firestore/use-collection.tsx`
   - `src/firebase/firestore/use-doc.tsx`
   
2. **Firestore utilities:**
   - `src/firebase/non-blocking-updates.tsx` (if only used for Firestore)
   
3. **Test pages:**
   - `src/app/test-firestore/page.tsx`

## 🚀 Testing

1. **Start Data Connect Emulator:**
   ```bash
   firebase emulators:start --only dataconnect
   ```

2. **Verify Schema:**
   - Check emulator UI at http://localhost:4000
   - Navigate to Data Connect section
   - Verify tables are created

3. **Test Operations:**
   ```bash
   # In Genkit dev runner or separate script
   npm run genkit:dev
   ```

## 🔄 Migration Checklist

- [x] Create Data Connect schema
- [x] Define queries and mutations
- [x] Remove Firestore from Firebase provider
- [x] Update Firebase initialization
- [ ] Generate Data Connect SDK
- [ ] Update indoor-request page
- [ ] Update outdoor-request page
- [ ] Update dashboard page
- [ ] Update reception page
- [ ] Update dispatch page
- [ ] Update fleet page
- [ ] Test all CRUD operations
- [ ] Deploy to production

## 💡 Benefits of Data Connect

1. **Type Safety** - Full TypeScript types generated automatically
2. **Better Performance** - Cloud SQL backend is faster for complex queries
3. **Relationships** - Native support for foreign keys and joins
4. **Schema Evolution** - Easier to manage schema changes
5. **Cost Efficiency** - More predictable pricing than Firestore
6. **SQL Power** - Complex queries, aggregations, and analytics

## 📚 Resources

- [Firebase Data Connect Docs](https://firebase.google.com/docs/data-connect)
- [Data Connect Schema Reference](https://firebase.google.com/docs/data-connect/gql-schema-reference)
- [Generated SDK Usage](./src/dataconnect-generated/README.md)

## ⚠️ Important Notes

1. Data Connect uses **UUID** for IDs (not Firestore document IDs)
2. Timestamps are **ISO strings** or `Timestamp` type
3. All mutations require explicit field mapping
4. Auth integration works seamlessly with Firebase Auth
5. Emulator data doesn't persist between restarts (use seed data)

## 🆘 Troubleshooting

**SDK generation fails:**
```bash
# Make sure you're in the project root
firebase dataconnect:sdk:generate --config-id example
```

**Emulator connection issues:**
- Check `dataconnect/dataconnect.yaml` configuration
- Verify port 9399 is not in use
- Check Firebase project configuration

**Type errors after SDK generation:**
```bash
# Rebuild the project
npm run build
# Or restart TypeScript server in VS Code
```

---

**Need Help?** Check the generated SDK README at `src/dataconnect-generated/README.md`
