import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AssignVehicleToRequestData {
  transportRequest_update?: TransportRequest_Key | null;
}

export interface AssignVehicleToRequestVariables {
  requestId: UUIDString;
  vehicleId: UUIDString;
}

export interface CreateDispatchData {
  dispatch_insert: Dispatch_Key;
}

export interface CreateDispatchVariables {
  requestId: UUIDString;
  vehicleId: UUIDString;
  estimatedArrival?: TimestampString | null;
  notes?: string | null;
  dispatchedBy?: string | null;
}

export interface CreateTransportRequestData {
  transportRequest_insert: TransportRequest_Key;
}

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

export interface DeleteTransportRequestData {
  transportRequest_delete?: TransportRequest_Key | null;
}

export interface DeleteTransportRequestVariables {
  id: UUIDString;
}

export interface Dispatch_Key {
  id: UUIDString;
  __typename?: 'Dispatch_Key';
}

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

export interface GetTransportRequestByIdVariables {
  id: UUIDString;
}

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

export interface GetVehicleByIdVariables {
  id: UUIDString;
}

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

export interface RegisterVehicleData {
  vehicle_insert: Vehicle_Key;
}

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

export interface TransportRequest_Key {
  id: UUIDString;
  __typename?: 'TransportRequest_Key';
}

export interface UpdateDispatchStatusData {
  dispatch_update?: Dispatch_Key | null;
}

export interface UpdateDispatchStatusVariables {
  id: UUIDString;
  status: string;
  actualArrival?: TimestampString | null;
  completedAt?: TimestampString | null;
}

export interface UpdateTransportRequestStatusData {
  transportRequest_update?: TransportRequest_Key | null;
}

export interface UpdateTransportRequestStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateVehicleLocationData {
  vehicle_update?: Vehicle_Key | null;
}

export interface UpdateVehicleLocationVariables {
  id: UUIDString;
  currentLocation: string;
}

export interface UpdateVehicleStatusData {
  vehicle_update?: Vehicle_Key | null;
}

export interface UpdateVehicleStatusVariables {
  id: UUIDString;
  status: string;
}

export interface Vehicle_Key {
  id: UUIDString;
  __typename?: 'Vehicle_Key';
}

interface CreateTransportRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransportRequestVariables): MutationRef<CreateTransportRequestData, CreateTransportRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTransportRequestVariables): MutationRef<CreateTransportRequestData, CreateTransportRequestVariables>;
  operationName: string;
}
export const createTransportRequestRef: CreateTransportRequestRef;

export function createTransportRequest(vars: CreateTransportRequestVariables): MutationPromise<CreateTransportRequestData, CreateTransportRequestVariables>;
export function createTransportRequest(dc: DataConnect, vars: CreateTransportRequestVariables): MutationPromise<CreateTransportRequestData, CreateTransportRequestVariables>;

interface UpdateTransportRequestStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTransportRequestStatusVariables): MutationRef<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTransportRequestStatusVariables): MutationRef<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
  operationName: string;
}
export const updateTransportRequestStatusRef: UpdateTransportRequestStatusRef;

export function updateTransportRequestStatus(vars: UpdateTransportRequestStatusVariables): MutationPromise<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
export function updateTransportRequestStatus(dc: DataConnect, vars: UpdateTransportRequestStatusVariables): MutationPromise<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;

interface AssignVehicleToRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AssignVehicleToRequestVariables): MutationRef<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AssignVehicleToRequestVariables): MutationRef<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
  operationName: string;
}
export const assignVehicleToRequestRef: AssignVehicleToRequestRef;

export function assignVehicleToRequest(vars: AssignVehicleToRequestVariables): MutationPromise<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
export function assignVehicleToRequest(dc: DataConnect, vars: AssignVehicleToRequestVariables): MutationPromise<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;

interface RegisterVehicleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterVehicleVariables): MutationRef<RegisterVehicleData, RegisterVehicleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterVehicleVariables): MutationRef<RegisterVehicleData, RegisterVehicleVariables>;
  operationName: string;
}
export const registerVehicleRef: RegisterVehicleRef;

export function registerVehicle(vars: RegisterVehicleVariables): MutationPromise<RegisterVehicleData, RegisterVehicleVariables>;
export function registerVehicle(dc: DataConnect, vars: RegisterVehicleVariables): MutationPromise<RegisterVehicleData, RegisterVehicleVariables>;

interface UpdateVehicleStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleStatusVariables): MutationRef<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVehicleStatusVariables): MutationRef<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
  operationName: string;
}
export const updateVehicleStatusRef: UpdateVehicleStatusRef;

export function updateVehicleStatus(vars: UpdateVehicleStatusVariables): MutationPromise<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
export function updateVehicleStatus(dc: DataConnect, vars: UpdateVehicleStatusVariables): MutationPromise<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;

interface UpdateVehicleLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVehicleLocationVariables): MutationRef<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVehicleLocationVariables): MutationRef<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
  operationName: string;
}
export const updateVehicleLocationRef: UpdateVehicleLocationRef;

export function updateVehicleLocation(vars: UpdateVehicleLocationVariables): MutationPromise<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
export function updateVehicleLocation(dc: DataConnect, vars: UpdateVehicleLocationVariables): MutationPromise<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;

interface CreateDispatchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDispatchVariables): MutationRef<CreateDispatchData, CreateDispatchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDispatchVariables): MutationRef<CreateDispatchData, CreateDispatchVariables>;
  operationName: string;
}
export const createDispatchRef: CreateDispatchRef;

export function createDispatch(vars: CreateDispatchVariables): MutationPromise<CreateDispatchData, CreateDispatchVariables>;
export function createDispatch(dc: DataConnect, vars: CreateDispatchVariables): MutationPromise<CreateDispatchData, CreateDispatchVariables>;

interface UpdateDispatchStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDispatchStatusVariables): MutationRef<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDispatchStatusVariables): MutationRef<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
  operationName: string;
}
export const updateDispatchStatusRef: UpdateDispatchStatusRef;

export function updateDispatchStatus(vars: UpdateDispatchStatusVariables): MutationPromise<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
export function updateDispatchStatus(dc: DataConnect, vars: UpdateDispatchStatusVariables): MutationPromise<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;

interface DeleteTransportRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransportRequestVariables): MutationRef<DeleteTransportRequestData, DeleteTransportRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTransportRequestVariables): MutationRef<DeleteTransportRequestData, DeleteTransportRequestVariables>;
  operationName: string;
}
export const deleteTransportRequestRef: DeleteTransportRequestRef;

export function deleteTransportRequest(vars: DeleteTransportRequestVariables): MutationPromise<DeleteTransportRequestData, DeleteTransportRequestVariables>;
export function deleteTransportRequest(dc: DataConnect, vars: DeleteTransportRequestVariables): MutationPromise<DeleteTransportRequestData, DeleteTransportRequestVariables>;

interface ListTransportRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTransportRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTransportRequestsData, undefined>;
  operationName: string;
}
export const listTransportRequestsRef: ListTransportRequestsRef;

export function listTransportRequests(): QueryPromise<ListTransportRequestsData, undefined>;
export function listTransportRequests(dc: DataConnect): QueryPromise<ListTransportRequestsData, undefined>;

interface GetTransportRequestByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTransportRequestByIdVariables): QueryRef<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTransportRequestByIdVariables): QueryRef<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
  operationName: string;
}
export const getTransportRequestByIdRef: GetTransportRequestByIdRef;

export function getTransportRequestById(vars: GetTransportRequestByIdVariables): QueryPromise<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
export function getTransportRequestById(dc: DataConnect, vars: GetTransportRequestByIdVariables): QueryPromise<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;

interface ListVehiclesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListVehiclesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListVehiclesData, undefined>;
  operationName: string;
}
export const listVehiclesRef: ListVehiclesRef;

export function listVehicles(): QueryPromise<ListVehiclesData, undefined>;
export function listVehicles(dc: DataConnect): QueryPromise<ListVehiclesData, undefined>;

interface GetAvailableVehiclesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAvailableVehiclesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAvailableVehiclesData, undefined>;
  operationName: string;
}
export const getAvailableVehiclesRef: GetAvailableVehiclesRef;

export function getAvailableVehicles(): QueryPromise<GetAvailableVehiclesData, undefined>;
export function getAvailableVehicles(dc: DataConnect): QueryPromise<GetAvailableVehiclesData, undefined>;

interface GetVehicleByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVehicleByIdVariables): QueryRef<GetVehicleByIdData, GetVehicleByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVehicleByIdVariables): QueryRef<GetVehicleByIdData, GetVehicleByIdVariables>;
  operationName: string;
}
export const getVehicleByIdRef: GetVehicleByIdRef;

export function getVehicleById(vars: GetVehicleByIdVariables): QueryPromise<GetVehicleByIdData, GetVehicleByIdVariables>;
export function getVehicleById(dc: DataConnect, vars: GetVehicleByIdVariables): QueryPromise<GetVehicleByIdData, GetVehicleByIdVariables>;

interface ListDispatchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDispatchesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDispatchesData, undefined>;
  operationName: string;
}
export const listDispatchesRef: ListDispatchesRef;

export function listDispatches(): QueryPromise<ListDispatchesData, undefined>;
export function listDispatches(dc: DataConnect): QueryPromise<ListDispatchesData, undefined>;

