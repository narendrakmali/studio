# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateTransportRequest, useUpdateTransportRequestStatus, useAssignVehicleToRequest, useRegisterVehicle, useUpdateVehicleStatus, useUpdateVehicleLocation, useCreateDispatch, useUpdateDispatchStatus, useDeleteTransportRequest, useListTransportRequests } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateTransportRequest(createTransportRequestVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTransportRequestStatus(updateTransportRequestStatusVars);

const { data, isPending, isSuccess, isError, error } = useAssignVehicleToRequest(assignVehicleToRequestVars);

const { data, isPending, isSuccess, isError, error } = useRegisterVehicle(registerVehicleVars);

const { data, isPending, isSuccess, isError, error } = useUpdateVehicleStatus(updateVehicleStatusVars);

const { data, isPending, isSuccess, isError, error } = useUpdateVehicleLocation(updateVehicleLocationVars);

const { data, isPending, isSuccess, isError, error } = useCreateDispatch(createDispatchVars);

const { data, isPending, isSuccess, isError, error } = useUpdateDispatchStatus(updateDispatchStatusVars);

const { data, isPending, isSuccess, isError, error } = useDeleteTransportRequest(deleteTransportRequestVars);

const { data, isPending, isSuccess, isError, error } = useListTransportRequests();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createTransportRequest, updateTransportRequestStatus, assignVehicleToRequest, registerVehicle, updateVehicleStatus, updateVehicleLocation, createDispatch, updateDispatchStatus, deleteTransportRequest, listTransportRequests } from '@dataconnect/generated';


// Operation CreateTransportRequest:  For variables, look at type CreateTransportRequestVars in ../index.d.ts
const { data } = await CreateTransportRequest(dataConnect, createTransportRequestVars);

// Operation UpdateTransportRequestStatus:  For variables, look at type UpdateTransportRequestStatusVars in ../index.d.ts
const { data } = await UpdateTransportRequestStatus(dataConnect, updateTransportRequestStatusVars);

// Operation AssignVehicleToRequest:  For variables, look at type AssignVehicleToRequestVars in ../index.d.ts
const { data } = await AssignVehicleToRequest(dataConnect, assignVehicleToRequestVars);

// Operation RegisterVehicle:  For variables, look at type RegisterVehicleVars in ../index.d.ts
const { data } = await RegisterVehicle(dataConnect, registerVehicleVars);

// Operation UpdateVehicleStatus:  For variables, look at type UpdateVehicleStatusVars in ../index.d.ts
const { data } = await UpdateVehicleStatus(dataConnect, updateVehicleStatusVars);

// Operation UpdateVehicleLocation:  For variables, look at type UpdateVehicleLocationVars in ../index.d.ts
const { data } = await UpdateVehicleLocation(dataConnect, updateVehicleLocationVars);

// Operation CreateDispatch:  For variables, look at type CreateDispatchVars in ../index.d.ts
const { data } = await CreateDispatch(dataConnect, createDispatchVars);

// Operation UpdateDispatchStatus:  For variables, look at type UpdateDispatchStatusVars in ../index.d.ts
const { data } = await UpdateDispatchStatus(dataConnect, updateDispatchStatusVars);

// Operation DeleteTransportRequest:  For variables, look at type DeleteTransportRequestVars in ../index.d.ts
const { data } = await DeleteTransportRequest(dataConnect, deleteTransportRequestVars);

// Operation ListTransportRequests: 
const { data } = await ListTransportRequests(dataConnect);


```