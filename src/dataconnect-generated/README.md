# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTransportRequests*](#listtransportrequests)
  - [*GetTransportRequestById*](#gettransportrequestbyid)
  - [*ListVehicles*](#listvehicles)
  - [*GetAvailableVehicles*](#getavailablevehicles)
  - [*GetVehicleById*](#getvehiclebyid)
  - [*ListDispatches*](#listdispatches)
- [**Mutations**](#mutations)
  - [*CreateTransportRequest*](#createtransportrequest)
  - [*UpdateTransportRequestStatus*](#updatetransportrequeststatus)
  - [*AssignVehicleToRequest*](#assignvehicletorequest)
  - [*RegisterVehicle*](#registervehicle)
  - [*UpdateVehicleStatus*](#updatevehiclestatus)
  - [*UpdateVehicleLocation*](#updatevehiclelocation)
  - [*CreateDispatch*](#createdispatch)
  - [*UpdateDispatchStatus*](#updatedispatchstatus)
  - [*DeleteTransportRequest*](#deletetransportrequest)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListTransportRequests
You can execute the `ListTransportRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTransportRequests(): QueryPromise<ListTransportRequestsData, undefined>;

interface ListTransportRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTransportRequestsData, undefined>;
}
export const listTransportRequestsRef: ListTransportRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTransportRequests(dc: DataConnect): QueryPromise<ListTransportRequestsData, undefined>;

interface ListTransportRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListTransportRequestsData, undefined>;
}
export const listTransportRequestsRef: ListTransportRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTransportRequestsRef:
```typescript
const name = listTransportRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListTransportRequests` query has no variables.
### Return Type
Recall that executing the `ListTransportRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTransportRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTransportRequestsData {
  transportRequests: ({
    id: UUIDString;
    passengerName: string;
    department: string;
    purpose: string;
    phoneNumber?: string | null;
    employeeId?: string | null;
    pickupLocation: string;
    dropLocation: string;
    scheduledTime: TimestampString;
    status: string;
    priority?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    numberOfPassengers?: number | null;
    specialRequirements?: string | null;
    estimatedDistance?: number | null;
    requestType?: string | null;
    assignedVehicleId?: UUIDString | null;
    assignedVehicle?: {
      id: UUIDString;
      vehicleNumber: string;
      type: string;
      model: string;
      driverName: string;
      driverPhone: string;
      status: string;
    } & Vehicle_Key;
  } & TransportRequest_Key)[];
}
```
### Using `ListTransportRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTransportRequests } from '@dataconnect/generated';


// Call the `listTransportRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTransportRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTransportRequests(dataConnect);

console.log(data.transportRequests);

// Or, you can use the `Promise` API.
listTransportRequests().then((response) => {
  const data = response.data;
  console.log(data.transportRequests);
});
```

### Using `ListTransportRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTransportRequestsRef } from '@dataconnect/generated';


// Call the `listTransportRequestsRef()` function to get a reference to the query.
const ref = listTransportRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTransportRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.transportRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.transportRequests);
});
```

## GetTransportRequestById
You can execute the `GetTransportRequestById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTransportRequestById(vars: GetTransportRequestByIdVariables): QueryPromise<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;

interface GetTransportRequestByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTransportRequestByIdVariables): QueryRef<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
}
export const getTransportRequestByIdRef: GetTransportRequestByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTransportRequestById(dc: DataConnect, vars: GetTransportRequestByIdVariables): QueryPromise<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;

interface GetTransportRequestByIdRef {
  ...
  (dc: DataConnect, vars: GetTransportRequestByIdVariables): QueryRef<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
}
export const getTransportRequestByIdRef: GetTransportRequestByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTransportRequestByIdRef:
```typescript
const name = getTransportRequestByIdRef.operationName;
console.log(name);
```

### Variables
The `GetTransportRequestById` query requires an argument of type `GetTransportRequestByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTransportRequestByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTransportRequestById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTransportRequestByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTransportRequestByIdData {
  transportRequest?: {
    id: UUIDString;
    passengerName: string;
    department: string;
    purpose: string;
    phoneNumber?: string | null;
    employeeId?: string | null;
    pickupLocation: string;
    dropLocation: string;
    scheduledTime: TimestampString;
    status: string;
    priority?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
    numberOfPassengers?: number | null;
    specialRequirements?: string | null;
    estimatedDistance?: number | null;
    requestType?: string | null;
    assignedVehicleId?: UUIDString | null;
    assignedVehicle?: {
      id: UUIDString;
      vehicleNumber: string;
      type: string;
      model: string;
      capacity: number;
      driverName: string;
      driverPhone: string;
      status: string;
      currentLocation?: string | null;
      imageUrl?: string | null;
    } & Vehicle_Key;
  } & TransportRequest_Key;
}
```
### Using `GetTransportRequestById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTransportRequestById, GetTransportRequestByIdVariables } from '@dataconnect/generated';

// The `GetTransportRequestById` query requires an argument of type `GetTransportRequestByIdVariables`:
const getTransportRequestByIdVars: GetTransportRequestByIdVariables = {
  id: ..., 
};

// Call the `getTransportRequestById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTransportRequestById(getTransportRequestByIdVars);
// Variables can be defined inline as well.
const { data } = await getTransportRequestById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTransportRequestById(dataConnect, getTransportRequestByIdVars);

console.log(data.transportRequest);

// Or, you can use the `Promise` API.
getTransportRequestById(getTransportRequestByIdVars).then((response) => {
  const data = response.data;
  console.log(data.transportRequest);
});
```

### Using `GetTransportRequestById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTransportRequestByIdRef, GetTransportRequestByIdVariables } from '@dataconnect/generated';

// The `GetTransportRequestById` query requires an argument of type `GetTransportRequestByIdVariables`:
const getTransportRequestByIdVars: GetTransportRequestByIdVariables = {
  id: ..., 
};

// Call the `getTransportRequestByIdRef()` function to get a reference to the query.
const ref = getTransportRequestByIdRef(getTransportRequestByIdVars);
// Variables can be defined inline as well.
const ref = getTransportRequestByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTransportRequestByIdRef(dataConnect, getTransportRequestByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.transportRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.transportRequest);
});
```

## ListVehicles
You can execute the `ListVehicles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listVehicles(): QueryPromise<ListVehiclesData, undefined>;

interface ListVehiclesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVehiclesData, undefined>;
}
export const listVehiclesRef: ListVehiclesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listVehicles(dc: DataConnect): QueryPromise<ListVehiclesData, undefined>;

interface ListVehiclesRef {
  ...
  (dc: DataConnect): QueryRef<ListVehiclesData, undefined>;
}
export const listVehiclesRef: ListVehiclesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listVehiclesRef:
```typescript
const name = listVehiclesRef.operationName;
console.log(name);
```

### Variables
The `ListVehicles` query has no variables.
### Return Type
Recall that executing the `ListVehicles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListVehiclesData {
  vehicles: ({
    id: UUIDString;
    vehicleNumber: string;
    type: string;
    model: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    driverLicense?: string | null;
    status: string;
    currentLocation?: string | null;
    imageUrl?: string | null;
    registeredAt: TimestampString;
    lastMaintenanceDate?: TimestampString | null;
  } & Vehicle_Key)[];
}
```
### Using `ListVehicles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listVehicles } from '@dataconnect/generated';


// Call the `listVehicles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listVehicles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listVehicles(dataConnect);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
listVehicles().then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

### Using `ListVehicles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listVehiclesRef } from '@dataconnect/generated';


// Call the `listVehiclesRef()` function to get a reference to the query.
const ref = listVehiclesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listVehiclesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

## GetAvailableVehicles
You can execute the `GetAvailableVehicles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAvailableVehicles(): QueryPromise<GetAvailableVehiclesData, undefined>;

interface GetAvailableVehiclesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableVehiclesData, undefined>;
}
export const getAvailableVehiclesRef: GetAvailableVehiclesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAvailableVehicles(dc: DataConnect): QueryPromise<GetAvailableVehiclesData, undefined>;

interface GetAvailableVehiclesRef {
  ...
  (dc: DataConnect): QueryRef<GetAvailableVehiclesData, undefined>;
}
export const getAvailableVehiclesRef: GetAvailableVehiclesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAvailableVehiclesRef:
```typescript
const name = getAvailableVehiclesRef.operationName;
console.log(name);
```

### Variables
The `GetAvailableVehicles` query has no variables.
### Return Type
Recall that executing the `GetAvailableVehicles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAvailableVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAvailableVehiclesData {
  vehicles: ({
    id: UUIDString;
    vehicleNumber: string;
    type: string;
    model: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    status: string;
    currentLocation?: string | null;
    imageUrl?: string | null;
  } & Vehicle_Key)[];
}
```
### Using `GetAvailableVehicles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAvailableVehicles } from '@dataconnect/generated';


// Call the `getAvailableVehicles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAvailableVehicles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAvailableVehicles(dataConnect);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
getAvailableVehicles().then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

### Using `GetAvailableVehicles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAvailableVehiclesRef } from '@dataconnect/generated';


// Call the `getAvailableVehiclesRef()` function to get a reference to the query.
const ref = getAvailableVehiclesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAvailableVehiclesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicles);
});
```

## GetVehicleById
You can execute the `GetVehicleById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVehicleById(vars: GetVehicleByIdVariables): QueryPromise<GetVehicleByIdData, GetVehicleByIdVariables>;

interface GetVehicleByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVehicleByIdVariables): QueryRef<GetVehicleByIdData, GetVehicleByIdVariables>;
}
export const getVehicleByIdRef: GetVehicleByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVehicleById(dc: DataConnect, vars: GetVehicleByIdVariables): QueryPromise<GetVehicleByIdData, GetVehicleByIdVariables>;

interface GetVehicleByIdRef {
  ...
  (dc: DataConnect, vars: GetVehicleByIdVariables): QueryRef<GetVehicleByIdData, GetVehicleByIdVariables>;
}
export const getVehicleByIdRef: GetVehicleByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVehicleByIdRef:
```typescript
const name = getVehicleByIdRef.operationName;
console.log(name);
```

### Variables
The `GetVehicleById` query requires an argument of type `GetVehicleByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVehicleByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetVehicleById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVehicleByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVehicleByIdData {
  vehicle?: {
    id: UUIDString;
    vehicleNumber: string;
    type: string;
    model: string;
    capacity: number;
    driverName: string;
    driverPhone: string;
    driverLicense?: string | null;
    status: string;
    currentLocation?: string | null;
    imageUrl?: string | null;
    registeredAt: TimestampString;
    lastMaintenanceDate?: TimestampString | null;
  } & Vehicle_Key;
}
```
### Using `GetVehicleById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVehicleById, GetVehicleByIdVariables } from '@dataconnect/generated';

// The `GetVehicleById` query requires an argument of type `GetVehicleByIdVariables`:
const getVehicleByIdVars: GetVehicleByIdVariables = {
  id: ..., 
};

// Call the `getVehicleById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVehicleById(getVehicleByIdVars);
// Variables can be defined inline as well.
const { data } = await getVehicleById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVehicleById(dataConnect, getVehicleByIdVars);

console.log(data.vehicle);

// Or, you can use the `Promise` API.
getVehicleById(getVehicleByIdVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle);
});
```

### Using `GetVehicleById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVehicleByIdRef, GetVehicleByIdVariables } from '@dataconnect/generated';

// The `GetVehicleById` query requires an argument of type `GetVehicleByIdVariables`:
const getVehicleByIdVars: GetVehicleByIdVariables = {
  id: ..., 
};

// Call the `getVehicleByIdRef()` function to get a reference to the query.
const ref = getVehicleByIdRef(getVehicleByIdVars);
// Variables can be defined inline as well.
const ref = getVehicleByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVehicleByIdRef(dataConnect, getVehicleByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vehicle);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle);
});
```

## ListDispatches
You can execute the `ListDispatches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDispatches(): QueryPromise<ListDispatchesData, undefined>;

interface ListDispatchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDispatchesData, undefined>;
}
export const listDispatchesRef: ListDispatchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDispatches(dc: DataConnect): QueryPromise<ListDispatchesData, undefined>;

interface ListDispatchesRef {
  ...
  (dc: DataConnect): QueryRef<ListDispatchesData, undefined>;
}
export const listDispatchesRef: ListDispatchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDispatchesRef:
```typescript
const name = listDispatchesRef.operationName;
console.log(name);
```

### Variables
The `ListDispatches` query has no variables.
### Return Type
Recall that executing the `ListDispatches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDispatchesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDispatchesData {
  dispatches: ({
    id: UUIDString;
    requestId: UUIDString;
    vehicleId: UUIDString;
    dispatchedAt: TimestampString;
    estimatedArrival?: TimestampString | null;
    actualArrival?: TimestampString | null;
    completedAt?: TimestampString | null;
    status: string;
    notes?: string | null;
    dispatchedBy?: string | null;
    request: {
      id: UUIDString;
      passengerName: string;
      pickupLocation: string;
      dropLocation: string;
      scheduledTime: TimestampString;
    } & TransportRequest_Key;
      vehicle: {
        id: UUIDString;
        vehicleNumber: string;
        type: string;
        driverName: string;
        driverPhone: string;
      } & Vehicle_Key;
  } & Dispatch_Key)[];
}
```
### Using `ListDispatches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDispatches } from '@dataconnect/generated';


// Call the `listDispatches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDispatches();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDispatches(dataConnect);

console.log(data.dispatches);

// Or, you can use the `Promise` API.
listDispatches().then((response) => {
  const data = response.data;
  console.log(data.dispatches);
});
```

### Using `ListDispatches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDispatchesRef } from '@dataconnect/generated';


// Call the `listDispatchesRef()` function to get a reference to the query.
const ref = listDispatchesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDispatchesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dispatches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dispatches);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTransportRequest
You can execute the `CreateTransportRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTransportRequest(vars: CreateTransportRequestVariables): MutationPromise<CreateTransportRequestData, CreateTransportRequestVariables>;

interface CreateTransportRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransportRequestVariables): MutationRef<CreateTransportRequestData, CreateTransportRequestVariables>;
}
export const createTransportRequestRef: CreateTransportRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTransportRequest(dc: DataConnect, vars: CreateTransportRequestVariables): MutationPromise<CreateTransportRequestData, CreateTransportRequestVariables>;

interface CreateTransportRequestRef {
  ...
  (dc: DataConnect, vars: CreateTransportRequestVariables): MutationRef<CreateTransportRequestData, CreateTransportRequestVariables>;
}
export const createTransportRequestRef: CreateTransportRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTransportRequestRef:
```typescript
const name = createTransportRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateTransportRequest` mutation requires an argument of type `CreateTransportRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTransportRequestVariables {
  passengerName: string;
  department: string;
  purpose: string;
  phoneNumber?: string | null;
  employeeId?: string | null;
  pickupLocation: string;
  dropLocation: string;
  scheduledTime: TimestampString;
  priority?: string | null;
  specialRequirements?: string | null;
  numberOfPassengers?: number | null;
  estimatedDistance?: number | null;
  requestType?: string | null;
}
```
### Return Type
Recall that executing the `CreateTransportRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTransportRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTransportRequestData {
  transportRequest_insert: TransportRequest_Key;
}
```
### Using `CreateTransportRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTransportRequest, CreateTransportRequestVariables } from '@dataconnect/generated';

// The `CreateTransportRequest` mutation requires an argument of type `CreateTransportRequestVariables`:
const createTransportRequestVars: CreateTransportRequestVariables = {
  passengerName: ..., 
  department: ..., 
  purpose: ..., 
  phoneNumber: ..., // optional
  employeeId: ..., // optional
  pickupLocation: ..., 
  dropLocation: ..., 
  scheduledTime: ..., 
  priority: ..., // optional
  specialRequirements: ..., // optional
  numberOfPassengers: ..., // optional
  estimatedDistance: ..., // optional
  requestType: ..., // optional
};

// Call the `createTransportRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTransportRequest(createTransportRequestVars);
// Variables can be defined inline as well.
const { data } = await createTransportRequest({ passengerName: ..., department: ..., purpose: ..., phoneNumber: ..., employeeId: ..., pickupLocation: ..., dropLocation: ..., scheduledTime: ..., priority: ..., specialRequirements: ..., numberOfPassengers: ..., estimatedDistance: ..., requestType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTransportRequest(dataConnect, createTransportRequestVars);

console.log(data.transportRequest_insert);

// Or, you can use the `Promise` API.
createTransportRequest(createTransportRequestVars).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_insert);
});
```

### Using `CreateTransportRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTransportRequestRef, CreateTransportRequestVariables } from '@dataconnect/generated';

// The `CreateTransportRequest` mutation requires an argument of type `CreateTransportRequestVariables`:
const createTransportRequestVars: CreateTransportRequestVariables = {
  passengerName: ..., 
  department: ..., 
  purpose: ..., 
  phoneNumber: ..., // optional
  employeeId: ..., // optional
  pickupLocation: ..., 
  dropLocation: ..., 
  scheduledTime: ..., 
  priority: ..., // optional
  specialRequirements: ..., // optional
  numberOfPassengers: ..., // optional
  estimatedDistance: ..., // optional
  requestType: ..., // optional
};

// Call the `createTransportRequestRef()` function to get a reference to the mutation.
const ref = createTransportRequestRef(createTransportRequestVars);
// Variables can be defined inline as well.
const ref = createTransportRequestRef({ passengerName: ..., department: ..., purpose: ..., phoneNumber: ..., employeeId: ..., pickupLocation: ..., dropLocation: ..., scheduledTime: ..., priority: ..., specialRequirements: ..., numberOfPassengers: ..., estimatedDistance: ..., requestType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTransportRequestRef(dataConnect, createTransportRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transportRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_insert);
});
```

## UpdateTransportRequestStatus
You can execute the `UpdateTransportRequestStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTransportRequestStatus(vars: UpdateTransportRequestStatusVariables): MutationPromise<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;

interface UpdateTransportRequestStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTransportRequestStatusVariables): MutationRef<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
}
export const updateTransportRequestStatusRef: UpdateTransportRequestStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTransportRequestStatus(dc: DataConnect, vars: UpdateTransportRequestStatusVariables): MutationPromise<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;

interface UpdateTransportRequestStatusRef {
  ...
  (dc: DataConnect, vars: UpdateTransportRequestStatusVariables): MutationRef<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
}
export const updateTransportRequestStatusRef: UpdateTransportRequestStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTransportRequestStatusRef:
```typescript
const name = updateTransportRequestStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateTransportRequestStatus` mutation requires an argument of type `UpdateTransportRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTransportRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateTransportRequestStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTransportRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTransportRequestStatusData {
  transportRequest_update?: TransportRequest_Key | null;
}
```
### Using `UpdateTransportRequestStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTransportRequestStatus, UpdateTransportRequestStatusVariables } from '@dataconnect/generated';

// The `UpdateTransportRequestStatus` mutation requires an argument of type `UpdateTransportRequestStatusVariables`:
const updateTransportRequestStatusVars: UpdateTransportRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateTransportRequestStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTransportRequestStatus(updateTransportRequestStatusVars);
// Variables can be defined inline as well.
const { data } = await updateTransportRequestStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTransportRequestStatus(dataConnect, updateTransportRequestStatusVars);

console.log(data.transportRequest_update);

// Or, you can use the `Promise` API.
updateTransportRequestStatus(updateTransportRequestStatusVars).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_update);
});
```

### Using `UpdateTransportRequestStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTransportRequestStatusRef, UpdateTransportRequestStatusVariables } from '@dataconnect/generated';

// The `UpdateTransportRequestStatus` mutation requires an argument of type `UpdateTransportRequestStatusVariables`:
const updateTransportRequestStatusVars: UpdateTransportRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateTransportRequestStatusRef()` function to get a reference to the mutation.
const ref = updateTransportRequestStatusRef(updateTransportRequestStatusVars);
// Variables can be defined inline as well.
const ref = updateTransportRequestStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTransportRequestStatusRef(dataConnect, updateTransportRequestStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transportRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_update);
});
```

## AssignVehicleToRequest
You can execute the `AssignVehicleToRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
assignVehicleToRequest(vars: AssignVehicleToRequestVariables): MutationPromise<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;

interface AssignVehicleToRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignVehicleToRequestVariables): MutationRef<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
}
export const assignVehicleToRequestRef: AssignVehicleToRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
assignVehicleToRequest(dc: DataConnect, vars: AssignVehicleToRequestVariables): MutationPromise<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;

interface AssignVehicleToRequestRef {
  ...
  (dc: DataConnect, vars: AssignVehicleToRequestVariables): MutationRef<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
}
export const assignVehicleToRequestRef: AssignVehicleToRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the assignVehicleToRequestRef:
```typescript
const name = assignVehicleToRequestRef.operationName;
console.log(name);
```

### Variables
The `AssignVehicleToRequest` mutation requires an argument of type `AssignVehicleToRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AssignVehicleToRequestVariables {
  requestId: UUIDString;
  vehicleId: UUIDString;
}
```
### Return Type
Recall that executing the `AssignVehicleToRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AssignVehicleToRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AssignVehicleToRequestData {
  transportRequest_update?: TransportRequest_Key | null;
}
```
### Using `AssignVehicleToRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, assignVehicleToRequest, AssignVehicleToRequestVariables } from '@dataconnect/generated';

// The `AssignVehicleToRequest` mutation requires an argument of type `AssignVehicleToRequestVariables`:
const assignVehicleToRequestVars: AssignVehicleToRequestVariables = {
  requestId: ..., 
  vehicleId: ..., 
};

// Call the `assignVehicleToRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await assignVehicleToRequest(assignVehicleToRequestVars);
// Variables can be defined inline as well.
const { data } = await assignVehicleToRequest({ requestId: ..., vehicleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await assignVehicleToRequest(dataConnect, assignVehicleToRequestVars);

console.log(data.transportRequest_update);

// Or, you can use the `Promise` API.
assignVehicleToRequest(assignVehicleToRequestVars).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_update);
});
```

### Using `AssignVehicleToRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, assignVehicleToRequestRef, AssignVehicleToRequestVariables } from '@dataconnect/generated';

// The `AssignVehicleToRequest` mutation requires an argument of type `AssignVehicleToRequestVariables`:
const assignVehicleToRequestVars: AssignVehicleToRequestVariables = {
  requestId: ..., 
  vehicleId: ..., 
};

// Call the `assignVehicleToRequestRef()` function to get a reference to the mutation.
const ref = assignVehicleToRequestRef(assignVehicleToRequestVars);
// Variables can be defined inline as well.
const ref = assignVehicleToRequestRef({ requestId: ..., vehicleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = assignVehicleToRequestRef(dataConnect, assignVehicleToRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transportRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_update);
});
```

## RegisterVehicle
You can execute the `RegisterVehicle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registerVehicle(vars: RegisterVehicleVariables): MutationPromise<RegisterVehicleData, RegisterVehicleVariables>;

interface RegisterVehicleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterVehicleVariables): MutationRef<RegisterVehicleData, RegisterVehicleVariables>;
}
export const registerVehicleRef: RegisterVehicleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerVehicle(dc: DataConnect, vars: RegisterVehicleVariables): MutationPromise<RegisterVehicleData, RegisterVehicleVariables>;

interface RegisterVehicleRef {
  ...
  (dc: DataConnect, vars: RegisterVehicleVariables): MutationRef<RegisterVehicleData, RegisterVehicleVariables>;
}
export const registerVehicleRef: RegisterVehicleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerVehicleRef:
```typescript
const name = registerVehicleRef.operationName;
console.log(name);
```

### Variables
The `RegisterVehicle` mutation requires an argument of type `RegisterVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterVehicleVariables {
  vehicleNumber: string;
  type: string;
  model: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicense?: string | null;
  imageUrl?: string | null;
  currentLocation?: string | null;
}
```
### Return Type
Recall that executing the `RegisterVehicle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterVehicleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterVehicleData {
  vehicle_insert: Vehicle_Key;
}
```
### Using `RegisterVehicle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerVehicle, RegisterVehicleVariables } from '@dataconnect/generated';

// The `RegisterVehicle` mutation requires an argument of type `RegisterVehicleVariables`:
const registerVehicleVars: RegisterVehicleVariables = {
  vehicleNumber: ..., 
  type: ..., 
  model: ..., 
  capacity: ..., 
  driverName: ..., 
  driverPhone: ..., 
  driverLicense: ..., // optional
  imageUrl: ..., // optional
  currentLocation: ..., // optional
};

// Call the `registerVehicle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerVehicle(registerVehicleVars);
// Variables can be defined inline as well.
const { data } = await registerVehicle({ vehicleNumber: ..., type: ..., model: ..., capacity: ..., driverName: ..., driverPhone: ..., driverLicense: ..., imageUrl: ..., currentLocation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerVehicle(dataConnect, registerVehicleVars);

console.log(data.vehicle_insert);

// Or, you can use the `Promise` API.
registerVehicle(registerVehicleVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_insert);
});
```

### Using `RegisterVehicle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerVehicleRef, RegisterVehicleVariables } from '@dataconnect/generated';

// The `RegisterVehicle` mutation requires an argument of type `RegisterVehicleVariables`:
const registerVehicleVars: RegisterVehicleVariables = {
  vehicleNumber: ..., 
  type: ..., 
  model: ..., 
  capacity: ..., 
  driverName: ..., 
  driverPhone: ..., 
  driverLicense: ..., // optional
  imageUrl: ..., // optional
  currentLocation: ..., // optional
};

// Call the `registerVehicleRef()` function to get a reference to the mutation.
const ref = registerVehicleRef(registerVehicleVars);
// Variables can be defined inline as well.
const ref = registerVehicleRef({ vehicleNumber: ..., type: ..., model: ..., capacity: ..., driverName: ..., driverPhone: ..., driverLicense: ..., imageUrl: ..., currentLocation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerVehicleRef(dataConnect, registerVehicleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_insert);
});
```

## UpdateVehicleStatus
You can execute the `UpdateVehicleStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateVehicleStatus(vars: UpdateVehicleStatusVariables): MutationPromise<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;

interface UpdateVehicleStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleStatusVariables): MutationRef<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
}
export const updateVehicleStatusRef: UpdateVehicleStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVehicleStatus(dc: DataConnect, vars: UpdateVehicleStatusVariables): MutationPromise<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;

interface UpdateVehicleStatusRef {
  ...
  (dc: DataConnect, vars: UpdateVehicleStatusVariables): MutationRef<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
}
export const updateVehicleStatusRef: UpdateVehicleStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVehicleStatusRef:
```typescript
const name = updateVehicleStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateVehicleStatus` mutation requires an argument of type `UpdateVehicleStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVehicleStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateVehicleStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVehicleStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVehicleStatusData {
  vehicle_update?: Vehicle_Key | null;
}
```
### Using `UpdateVehicleStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVehicleStatus, UpdateVehicleStatusVariables } from '@dataconnect/generated';

// The `UpdateVehicleStatus` mutation requires an argument of type `UpdateVehicleStatusVariables`:
const updateVehicleStatusVars: UpdateVehicleStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateVehicleStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVehicleStatus(updateVehicleStatusVars);
// Variables can be defined inline as well.
const { data } = await updateVehicleStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVehicleStatus(dataConnect, updateVehicleStatusVars);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
updateVehicleStatus(updateVehicleStatusVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

### Using `UpdateVehicleStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVehicleStatusRef, UpdateVehicleStatusVariables } from '@dataconnect/generated';

// The `UpdateVehicleStatus` mutation requires an argument of type `UpdateVehicleStatusVariables`:
const updateVehicleStatusVars: UpdateVehicleStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateVehicleStatusRef()` function to get a reference to the mutation.
const ref = updateVehicleStatusRef(updateVehicleStatusVars);
// Variables can be defined inline as well.
const ref = updateVehicleStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVehicleStatusRef(dataConnect, updateVehicleStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

## UpdateVehicleLocation
You can execute the `UpdateVehicleLocation` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateVehicleLocation(vars: UpdateVehicleLocationVariables): MutationPromise<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;

interface UpdateVehicleLocationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleLocationVariables): MutationRef<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
}
export const updateVehicleLocationRef: UpdateVehicleLocationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVehicleLocation(dc: DataConnect, vars: UpdateVehicleLocationVariables): MutationPromise<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;

interface UpdateVehicleLocationRef {
  ...
  (dc: DataConnect, vars: UpdateVehicleLocationVariables): MutationRef<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
}
export const updateVehicleLocationRef: UpdateVehicleLocationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVehicleLocationRef:
```typescript
const name = updateVehicleLocationRef.operationName;
console.log(name);
```

### Variables
The `UpdateVehicleLocation` mutation requires an argument of type `UpdateVehicleLocationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVehicleLocationVariables {
  id: UUIDString;
  currentLocation: string;
}
```
### Return Type
Recall that executing the `UpdateVehicleLocation` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVehicleLocationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVehicleLocationData {
  vehicle_update?: Vehicle_Key | null;
}
```
### Using `UpdateVehicleLocation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVehicleLocation, UpdateVehicleLocationVariables } from '@dataconnect/generated';

// The `UpdateVehicleLocation` mutation requires an argument of type `UpdateVehicleLocationVariables`:
const updateVehicleLocationVars: UpdateVehicleLocationVariables = {
  id: ..., 
  currentLocation: ..., 
};

// Call the `updateVehicleLocation()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVehicleLocation(updateVehicleLocationVars);
// Variables can be defined inline as well.
const { data } = await updateVehicleLocation({ id: ..., currentLocation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVehicleLocation(dataConnect, updateVehicleLocationVars);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
updateVehicleLocation(updateVehicleLocationVars).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

### Using `UpdateVehicleLocation`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVehicleLocationRef, UpdateVehicleLocationVariables } from '@dataconnect/generated';

// The `UpdateVehicleLocation` mutation requires an argument of type `UpdateVehicleLocationVariables`:
const updateVehicleLocationVars: UpdateVehicleLocationVariables = {
  id: ..., 
  currentLocation: ..., 
};

// Call the `updateVehicleLocationRef()` function to get a reference to the mutation.
const ref = updateVehicleLocationRef(updateVehicleLocationVars);
// Variables can be defined inline as well.
const ref = updateVehicleLocationRef({ id: ..., currentLocation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVehicleLocationRef(dataConnect, updateVehicleLocationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vehicle_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vehicle_update);
});
```

## CreateDispatch
You can execute the `CreateDispatch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDispatch(vars: CreateDispatchVariables): MutationPromise<CreateDispatchData, CreateDispatchVariables>;

interface CreateDispatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDispatchVariables): MutationRef<CreateDispatchData, CreateDispatchVariables>;
}
export const createDispatchRef: CreateDispatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDispatch(dc: DataConnect, vars: CreateDispatchVariables): MutationPromise<CreateDispatchData, CreateDispatchVariables>;

interface CreateDispatchRef {
  ...
  (dc: DataConnect, vars: CreateDispatchVariables): MutationRef<CreateDispatchData, CreateDispatchVariables>;
}
export const createDispatchRef: CreateDispatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDispatchRef:
```typescript
const name = createDispatchRef.operationName;
console.log(name);
```

### Variables
The `CreateDispatch` mutation requires an argument of type `CreateDispatchVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDispatchVariables {
  requestId: UUIDString;
  vehicleId: UUIDString;
  estimatedArrival?: TimestampString | null;
  notes?: string | null;
  dispatchedBy?: string | null;
}
```
### Return Type
Recall that executing the `CreateDispatch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDispatchData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDispatchData {
  dispatch_insert: Dispatch_Key;
}
```
### Using `CreateDispatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDispatch, CreateDispatchVariables } from '@dataconnect/generated';

// The `CreateDispatch` mutation requires an argument of type `CreateDispatchVariables`:
const createDispatchVars: CreateDispatchVariables = {
  requestId: ..., 
  vehicleId: ..., 
  estimatedArrival: ..., // optional
  notes: ..., // optional
  dispatchedBy: ..., // optional
};

// Call the `createDispatch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDispatch(createDispatchVars);
// Variables can be defined inline as well.
const { data } = await createDispatch({ requestId: ..., vehicleId: ..., estimatedArrival: ..., notes: ..., dispatchedBy: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDispatch(dataConnect, createDispatchVars);

console.log(data.dispatch_insert);

// Or, you can use the `Promise` API.
createDispatch(createDispatchVars).then((response) => {
  const data = response.data;
  console.log(data.dispatch_insert);
});
```

### Using `CreateDispatch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDispatchRef, CreateDispatchVariables } from '@dataconnect/generated';

// The `CreateDispatch` mutation requires an argument of type `CreateDispatchVariables`:
const createDispatchVars: CreateDispatchVariables = {
  requestId: ..., 
  vehicleId: ..., 
  estimatedArrival: ..., // optional
  notes: ..., // optional
  dispatchedBy: ..., // optional
};

// Call the `createDispatchRef()` function to get a reference to the mutation.
const ref = createDispatchRef(createDispatchVars);
// Variables can be defined inline as well.
const ref = createDispatchRef({ requestId: ..., vehicleId: ..., estimatedArrival: ..., notes: ..., dispatchedBy: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDispatchRef(dataConnect, createDispatchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dispatch_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dispatch_insert);
});
```

## UpdateDispatchStatus
You can execute the `UpdateDispatchStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDispatchStatus(vars: UpdateDispatchStatusVariables): MutationPromise<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;

interface UpdateDispatchStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDispatchStatusVariables): MutationRef<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
}
export const updateDispatchStatusRef: UpdateDispatchStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDispatchStatus(dc: DataConnect, vars: UpdateDispatchStatusVariables): MutationPromise<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;

interface UpdateDispatchStatusRef {
  ...
  (dc: DataConnect, vars: UpdateDispatchStatusVariables): MutationRef<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
}
export const updateDispatchStatusRef: UpdateDispatchStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDispatchStatusRef:
```typescript
const name = updateDispatchStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateDispatchStatus` mutation requires an argument of type `UpdateDispatchStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDispatchStatusVariables {
  id: UUIDString;
  status: string;
  actualArrival?: TimestampString | null;
  completedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateDispatchStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDispatchStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDispatchStatusData {
  dispatch_update?: Dispatch_Key | null;
}
```
### Using `UpdateDispatchStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDispatchStatus, UpdateDispatchStatusVariables } from '@dataconnect/generated';

// The `UpdateDispatchStatus` mutation requires an argument of type `UpdateDispatchStatusVariables`:
const updateDispatchStatusVars: UpdateDispatchStatusVariables = {
  id: ..., 
  status: ..., 
  actualArrival: ..., // optional
  completedAt: ..., // optional
};

// Call the `updateDispatchStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDispatchStatus(updateDispatchStatusVars);
// Variables can be defined inline as well.
const { data } = await updateDispatchStatus({ id: ..., status: ..., actualArrival: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDispatchStatus(dataConnect, updateDispatchStatusVars);

console.log(data.dispatch_update);

// Or, you can use the `Promise` API.
updateDispatchStatus(updateDispatchStatusVars).then((response) => {
  const data = response.data;
  console.log(data.dispatch_update);
});
```

### Using `UpdateDispatchStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDispatchStatusRef, UpdateDispatchStatusVariables } from '@dataconnect/generated';

// The `UpdateDispatchStatus` mutation requires an argument of type `UpdateDispatchStatusVariables`:
const updateDispatchStatusVars: UpdateDispatchStatusVariables = {
  id: ..., 
  status: ..., 
  actualArrival: ..., // optional
  completedAt: ..., // optional
};

// Call the `updateDispatchStatusRef()` function to get a reference to the mutation.
const ref = updateDispatchStatusRef(updateDispatchStatusVars);
// Variables can be defined inline as well.
const ref = updateDispatchStatusRef({ id: ..., status: ..., actualArrival: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDispatchStatusRef(dataConnect, updateDispatchStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dispatch_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dispatch_update);
});
```

## DeleteTransportRequest
You can execute the `DeleteTransportRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTransportRequest(vars: DeleteTransportRequestVariables): MutationPromise<DeleteTransportRequestData, DeleteTransportRequestVariables>;

interface DeleteTransportRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransportRequestVariables): MutationRef<DeleteTransportRequestData, DeleteTransportRequestVariables>;
}
export const deleteTransportRequestRef: DeleteTransportRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTransportRequest(dc: DataConnect, vars: DeleteTransportRequestVariables): MutationPromise<DeleteTransportRequestData, DeleteTransportRequestVariables>;

interface DeleteTransportRequestRef {
  ...
  (dc: DataConnect, vars: DeleteTransportRequestVariables): MutationRef<DeleteTransportRequestData, DeleteTransportRequestVariables>;
}
export const deleteTransportRequestRef: DeleteTransportRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTransportRequestRef:
```typescript
const name = deleteTransportRequestRef.operationName;
console.log(name);
```

### Variables
The `DeleteTransportRequest` mutation requires an argument of type `DeleteTransportRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTransportRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTransportRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTransportRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTransportRequestData {
  transportRequest_delete?: TransportRequest_Key | null;
}
```
### Using `DeleteTransportRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTransportRequest, DeleteTransportRequestVariables } from '@dataconnect/generated';

// The `DeleteTransportRequest` mutation requires an argument of type `DeleteTransportRequestVariables`:
const deleteTransportRequestVars: DeleteTransportRequestVariables = {
  id: ..., 
};

// Call the `deleteTransportRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTransportRequest(deleteTransportRequestVars);
// Variables can be defined inline as well.
const { data } = await deleteTransportRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTransportRequest(dataConnect, deleteTransportRequestVars);

console.log(data.transportRequest_delete);

// Or, you can use the `Promise` API.
deleteTransportRequest(deleteTransportRequestVars).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_delete);
});
```

### Using `DeleteTransportRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTransportRequestRef, DeleteTransportRequestVariables } from '@dataconnect/generated';

// The `DeleteTransportRequest` mutation requires an argument of type `DeleteTransportRequestVariables`:
const deleteTransportRequestVars: DeleteTransportRequestVariables = {
  id: ..., 
};

// Call the `deleteTransportRequestRef()` function to get a reference to the mutation.
const ref = deleteTransportRequestRef(deleteTransportRequestVars);
// Variables can be defined inline as well.
const ref = deleteTransportRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTransportRequestRef(dataConnect, deleteTransportRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transportRequest_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transportRequest_delete);
});
```

