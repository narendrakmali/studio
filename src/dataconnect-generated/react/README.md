# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListTransportRequests
You can execute the `ListTransportRequests` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListTransportRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListTransportRequestsData>): UseDataConnectQueryResult<ListTransportRequestsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListTransportRequests(options?: useDataConnectQueryOptions<ListTransportRequestsData>): UseDataConnectQueryResult<ListTransportRequestsData, undefined>;
```

### Variables
The `ListTransportRequests` Query has no variables.
### Return Type
Recall that calling the `ListTransportRequests` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListTransportRequests` Query is of type `ListTransportRequestsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListTransportRequests`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListTransportRequests } from '@dataconnect/generated/react'

export default function ListTransportRequestsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListTransportRequests();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListTransportRequests(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListTransportRequests(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListTransportRequests(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.transportRequests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetTransportRequestById
You can execute the `GetTransportRequestById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetTransportRequestById(dc: DataConnect, vars: GetTransportRequestByIdVariables, options?: useDataConnectQueryOptions<GetTransportRequestByIdData>): UseDataConnectQueryResult<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetTransportRequestById(vars: GetTransportRequestByIdVariables, options?: useDataConnectQueryOptions<GetTransportRequestByIdData>): UseDataConnectQueryResult<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
```

### Variables
The `GetTransportRequestById` Query requires an argument of type `GetTransportRequestByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetTransportRequestByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetTransportRequestById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetTransportRequestById` Query is of type `GetTransportRequestByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetTransportRequestById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetTransportRequestByIdVariables } from '@dataconnect/generated';
import { useGetTransportRequestById } from '@dataconnect/generated/react'

export default function GetTransportRequestByIdComponent() {
  // The `useGetTransportRequestById` Query hook requires an argument of type `GetTransportRequestByIdVariables`:
  const getTransportRequestByIdVars: GetTransportRequestByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetTransportRequestById(getTransportRequestByIdVars);
  // Variables can be defined inline as well.
  const query = useGetTransportRequestById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetTransportRequestById(dataConnect, getTransportRequestByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetTransportRequestById(getTransportRequestByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetTransportRequestById(dataConnect, getTransportRequestByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.transportRequest);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListVehicles
You can execute the `ListVehicles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<ListVehiclesData>): UseDataConnectQueryResult<ListVehiclesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListVehicles(options?: useDataConnectQueryOptions<ListVehiclesData>): UseDataConnectQueryResult<ListVehiclesData, undefined>;
```

### Variables
The `ListVehicles` Query has no variables.
### Return Type
Recall that calling the `ListVehicles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListVehicles` Query is of type `ListVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListVehicles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListVehicles } from '@dataconnect/generated/react'

export default function ListVehiclesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListVehicles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListVehicles(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListVehicles(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListVehicles(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.vehicles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetAvailableVehicles
You can execute the `GetAvailableVehicles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetAvailableVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<GetAvailableVehiclesData>): UseDataConnectQueryResult<GetAvailableVehiclesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetAvailableVehicles(options?: useDataConnectQueryOptions<GetAvailableVehiclesData>): UseDataConnectQueryResult<GetAvailableVehiclesData, undefined>;
```

### Variables
The `GetAvailableVehicles` Query has no variables.
### Return Type
Recall that calling the `GetAvailableVehicles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetAvailableVehicles` Query is of type `GetAvailableVehiclesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetAvailableVehicles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetAvailableVehicles } from '@dataconnect/generated/react'

export default function GetAvailableVehiclesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetAvailableVehicles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetAvailableVehicles(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetAvailableVehicles(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetAvailableVehicles(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.vehicles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetVehicleById
You can execute the `GetVehicleById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetVehicleById(dc: DataConnect, vars: GetVehicleByIdVariables, options?: useDataConnectQueryOptions<GetVehicleByIdData>): UseDataConnectQueryResult<GetVehicleByIdData, GetVehicleByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetVehicleById(vars: GetVehicleByIdVariables, options?: useDataConnectQueryOptions<GetVehicleByIdData>): UseDataConnectQueryResult<GetVehicleByIdData, GetVehicleByIdVariables>;
```

### Variables
The `GetVehicleById` Query requires an argument of type `GetVehicleByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetVehicleByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetVehicleById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetVehicleById` Query is of type `GetVehicleByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetVehicleById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetVehicleByIdVariables } from '@dataconnect/generated';
import { useGetVehicleById } from '@dataconnect/generated/react'

export default function GetVehicleByIdComponent() {
  // The `useGetVehicleById` Query hook requires an argument of type `GetVehicleByIdVariables`:
  const getVehicleByIdVars: GetVehicleByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetVehicleById(getVehicleByIdVars);
  // Variables can be defined inline as well.
  const query = useGetVehicleById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetVehicleById(dataConnect, getVehicleByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetVehicleById(getVehicleByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetVehicleById(dataConnect, getVehicleByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.vehicle);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListDispatches
You can execute the `ListDispatches` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListDispatches(dc: DataConnect, options?: useDataConnectQueryOptions<ListDispatchesData>): UseDataConnectQueryResult<ListDispatchesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListDispatches(options?: useDataConnectQueryOptions<ListDispatchesData>): UseDataConnectQueryResult<ListDispatchesData, undefined>;
```

### Variables
The `ListDispatches` Query has no variables.
### Return Type
Recall that calling the `ListDispatches` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListDispatches` Query is of type `ListDispatchesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListDispatches`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListDispatches } from '@dataconnect/generated/react'

export default function ListDispatchesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListDispatches();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListDispatches(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListDispatches(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListDispatches(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.dispatches);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateTransportRequest
You can execute the `CreateTransportRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTransportRequest(options?: useDataConnectMutationOptions<CreateTransportRequestData, FirebaseError, CreateTransportRequestVariables>): UseDataConnectMutationResult<CreateTransportRequestData, CreateTransportRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTransportRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTransportRequestData, FirebaseError, CreateTransportRequestVariables>): UseDataConnectMutationResult<CreateTransportRequestData, CreateTransportRequestVariables>;
```

### Variables
The `CreateTransportRequest` Mutation requires an argument of type `CreateTransportRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateTransportRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTransportRequest` Mutation is of type `CreateTransportRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTransportRequestData {
  transportRequest_insert: TransportRequest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTransportRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTransportRequestVariables } from '@dataconnect/generated';
import { useCreateTransportRequest } from '@dataconnect/generated/react'

export default function CreateTransportRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTransportRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTransportRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTransportRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTransportRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTransportRequest` Mutation requires an argument of type `CreateTransportRequestVariables`:
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
  mutation.mutate(createTransportRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ passengerName: ..., department: ..., purpose: ..., phoneNumber: ..., employeeId: ..., pickupLocation: ..., dropLocation: ..., scheduledTime: ..., priority: ..., specialRequirements: ..., numberOfPassengers: ..., estimatedDistance: ..., requestType: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createTransportRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transportRequest_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTransportRequestStatus
You can execute the `UpdateTransportRequestStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTransportRequestStatus(options?: useDataConnectMutationOptions<UpdateTransportRequestStatusData, FirebaseError, UpdateTransportRequestStatusVariables>): UseDataConnectMutationResult<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTransportRequestStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTransportRequestStatusData, FirebaseError, UpdateTransportRequestStatusVariables>): UseDataConnectMutationResult<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
```

### Variables
The `UpdateTransportRequestStatus` Mutation requires an argument of type `UpdateTransportRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateTransportRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that calling the `UpdateTransportRequestStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTransportRequestStatus` Mutation is of type `UpdateTransportRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTransportRequestStatusData {
  transportRequest_update?: TransportRequest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTransportRequestStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTransportRequestStatusVariables } from '@dataconnect/generated';
import { useUpdateTransportRequestStatus } from '@dataconnect/generated/react'

export default function UpdateTransportRequestStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTransportRequestStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTransportRequestStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTransportRequestStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTransportRequestStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTransportRequestStatus` Mutation requires an argument of type `UpdateTransportRequestStatusVariables`:
  const updateTransportRequestStatusVars: UpdateTransportRequestStatusVariables = {
    id: ..., 
    status: ..., 
  };
  mutation.mutate(updateTransportRequestStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateTransportRequestStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transportRequest_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AssignVehicleToRequest
You can execute the `AssignVehicleToRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAssignVehicleToRequest(options?: useDataConnectMutationOptions<AssignVehicleToRequestData, FirebaseError, AssignVehicleToRequestVariables>): UseDataConnectMutationResult<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAssignVehicleToRequest(dc: DataConnect, options?: useDataConnectMutationOptions<AssignVehicleToRequestData, FirebaseError, AssignVehicleToRequestVariables>): UseDataConnectMutationResult<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
```

### Variables
The `AssignVehicleToRequest` Mutation requires an argument of type `AssignVehicleToRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AssignVehicleToRequestVariables {
  requestId: UUIDString;
  vehicleId: UUIDString;
}
```
### Return Type
Recall that calling the `AssignVehicleToRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AssignVehicleToRequest` Mutation is of type `AssignVehicleToRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AssignVehicleToRequestData {
  transportRequest_update?: TransportRequest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AssignVehicleToRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AssignVehicleToRequestVariables } from '@dataconnect/generated';
import { useAssignVehicleToRequest } from '@dataconnect/generated/react'

export default function AssignVehicleToRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAssignVehicleToRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAssignVehicleToRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAssignVehicleToRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAssignVehicleToRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAssignVehicleToRequest` Mutation requires an argument of type `AssignVehicleToRequestVariables`:
  const assignVehicleToRequestVars: AssignVehicleToRequestVariables = {
    requestId: ..., 
    vehicleId: ..., 
  };
  mutation.mutate(assignVehicleToRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ requestId: ..., vehicleId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(assignVehicleToRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transportRequest_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## RegisterVehicle
You can execute the `RegisterVehicle` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRegisterVehicle(options?: useDataConnectMutationOptions<RegisterVehicleData, FirebaseError, RegisterVehicleVariables>): UseDataConnectMutationResult<RegisterVehicleData, RegisterVehicleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRegisterVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<RegisterVehicleData, FirebaseError, RegisterVehicleVariables>): UseDataConnectMutationResult<RegisterVehicleData, RegisterVehicleVariables>;
```

### Variables
The `RegisterVehicle` Mutation requires an argument of type `RegisterVehicleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `RegisterVehicle` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `RegisterVehicle` Mutation is of type `RegisterVehicleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RegisterVehicleData {
  vehicle_insert: Vehicle_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `RegisterVehicle`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RegisterVehicleVariables } from '@dataconnect/generated';
import { useRegisterVehicle } from '@dataconnect/generated/react'

export default function RegisterVehicleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRegisterVehicle();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRegisterVehicle(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegisterVehicle(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRegisterVehicle(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRegisterVehicle` Mutation requires an argument of type `RegisterVehicleVariables`:
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
  mutation.mutate(registerVehicleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ vehicleNumber: ..., type: ..., model: ..., capacity: ..., driverName: ..., driverPhone: ..., driverLicense: ..., imageUrl: ..., currentLocation: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(registerVehicleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehicle_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateVehicleStatus
You can execute the `UpdateVehicleStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateVehicleStatus(options?: useDataConnectMutationOptions<UpdateVehicleStatusData, FirebaseError, UpdateVehicleStatusVariables>): UseDataConnectMutationResult<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateVehicleStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleStatusData, FirebaseError, UpdateVehicleStatusVariables>): UseDataConnectMutationResult<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
```

### Variables
The `UpdateVehicleStatus` Mutation requires an argument of type `UpdateVehicleStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateVehicleStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that calling the `UpdateVehicleStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateVehicleStatus` Mutation is of type `UpdateVehicleStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateVehicleStatusData {
  vehicle_update?: Vehicle_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateVehicleStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateVehicleStatusVariables } from '@dataconnect/generated';
import { useUpdateVehicleStatus } from '@dataconnect/generated/react'

export default function UpdateVehicleStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateVehicleStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateVehicleStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateVehicleStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateVehicleStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateVehicleStatus` Mutation requires an argument of type `UpdateVehicleStatusVariables`:
  const updateVehicleStatusVars: UpdateVehicleStatusVariables = {
    id: ..., 
    status: ..., 
  };
  mutation.mutate(updateVehicleStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateVehicleStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehicle_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateVehicleLocation
You can execute the `UpdateVehicleLocation` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateVehicleLocation(options?: useDataConnectMutationOptions<UpdateVehicleLocationData, FirebaseError, UpdateVehicleLocationVariables>): UseDataConnectMutationResult<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateVehicleLocation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleLocationData, FirebaseError, UpdateVehicleLocationVariables>): UseDataConnectMutationResult<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
```

### Variables
The `UpdateVehicleLocation` Mutation requires an argument of type `UpdateVehicleLocationVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateVehicleLocationVariables {
  id: UUIDString;
  currentLocation: string;
}
```
### Return Type
Recall that calling the `UpdateVehicleLocation` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateVehicleLocation` Mutation is of type `UpdateVehicleLocationData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateVehicleLocationData {
  vehicle_update?: Vehicle_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateVehicleLocation`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateVehicleLocationVariables } from '@dataconnect/generated';
import { useUpdateVehicleLocation } from '@dataconnect/generated/react'

export default function UpdateVehicleLocationComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateVehicleLocation();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateVehicleLocation(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateVehicleLocation(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateVehicleLocation(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateVehicleLocation` Mutation requires an argument of type `UpdateVehicleLocationVariables`:
  const updateVehicleLocationVars: UpdateVehicleLocationVariables = {
    id: ..., 
    currentLocation: ..., 
  };
  mutation.mutate(updateVehicleLocationVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., currentLocation: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateVehicleLocationVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.vehicle_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateDispatch
You can execute the `CreateDispatch` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateDispatch(options?: useDataConnectMutationOptions<CreateDispatchData, FirebaseError, CreateDispatchVariables>): UseDataConnectMutationResult<CreateDispatchData, CreateDispatchVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateDispatch(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDispatchData, FirebaseError, CreateDispatchVariables>): UseDataConnectMutationResult<CreateDispatchData, CreateDispatchVariables>;
```

### Variables
The `CreateDispatch` Mutation requires an argument of type `CreateDispatchVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateDispatchVariables {
  requestId: UUIDString;
  vehicleId: UUIDString;
  estimatedArrival?: TimestampString | null;
  notes?: string | null;
  dispatchedBy?: string | null;
}
```
### Return Type
Recall that calling the `CreateDispatch` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateDispatch` Mutation is of type `CreateDispatchData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateDispatchData {
  dispatch_insert: Dispatch_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateDispatch`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateDispatchVariables } from '@dataconnect/generated';
import { useCreateDispatch } from '@dataconnect/generated/react'

export default function CreateDispatchComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateDispatch();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateDispatch(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateDispatch(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateDispatch(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateDispatch` Mutation requires an argument of type `CreateDispatchVariables`:
  const createDispatchVars: CreateDispatchVariables = {
    requestId: ..., 
    vehicleId: ..., 
    estimatedArrival: ..., // optional
    notes: ..., // optional
    dispatchedBy: ..., // optional
  };
  mutation.mutate(createDispatchVars);
  // Variables can be defined inline as well.
  mutation.mutate({ requestId: ..., vehicleId: ..., estimatedArrival: ..., notes: ..., dispatchedBy: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createDispatchVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.dispatch_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateDispatchStatus
You can execute the `UpdateDispatchStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateDispatchStatus(options?: useDataConnectMutationOptions<UpdateDispatchStatusData, FirebaseError, UpdateDispatchStatusVariables>): UseDataConnectMutationResult<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateDispatchStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDispatchStatusData, FirebaseError, UpdateDispatchStatusVariables>): UseDataConnectMutationResult<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
```

### Variables
The `UpdateDispatchStatus` Mutation requires an argument of type `UpdateDispatchStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateDispatchStatusVariables {
  id: UUIDString;
  status: string;
  actualArrival?: TimestampString | null;
  completedAt?: TimestampString | null;
}
```
### Return Type
Recall that calling the `UpdateDispatchStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateDispatchStatus` Mutation is of type `UpdateDispatchStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateDispatchStatusData {
  dispatch_update?: Dispatch_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateDispatchStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateDispatchStatusVariables } from '@dataconnect/generated';
import { useUpdateDispatchStatus } from '@dataconnect/generated/react'

export default function UpdateDispatchStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateDispatchStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateDispatchStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateDispatchStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateDispatchStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateDispatchStatus` Mutation requires an argument of type `UpdateDispatchStatusVariables`:
  const updateDispatchStatusVars: UpdateDispatchStatusVariables = {
    id: ..., 
    status: ..., 
    actualArrival: ..., // optional
    completedAt: ..., // optional
  };
  mutation.mutate(updateDispatchStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., actualArrival: ..., completedAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateDispatchStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.dispatch_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTransportRequest
You can execute the `DeleteTransportRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTransportRequest(options?: useDataConnectMutationOptions<DeleteTransportRequestData, FirebaseError, DeleteTransportRequestVariables>): UseDataConnectMutationResult<DeleteTransportRequestData, DeleteTransportRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTransportRequest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTransportRequestData, FirebaseError, DeleteTransportRequestVariables>): UseDataConnectMutationResult<DeleteTransportRequestData, DeleteTransportRequestVariables>;
```

### Variables
The `DeleteTransportRequest` Mutation requires an argument of type `DeleteTransportRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTransportRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteTransportRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTransportRequest` Mutation is of type `DeleteTransportRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTransportRequestData {
  transportRequest_delete?: TransportRequest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTransportRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTransportRequestVariables } from '@dataconnect/generated';
import { useDeleteTransportRequest } from '@dataconnect/generated/react'

export default function DeleteTransportRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTransportRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTransportRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTransportRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTransportRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTransportRequest` Mutation requires an argument of type `DeleteTransportRequestVariables`:
  const deleteTransportRequestVars: DeleteTransportRequestVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTransportRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTransportRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.transportRequest_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

