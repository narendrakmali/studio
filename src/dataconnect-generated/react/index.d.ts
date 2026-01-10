import { CreateTransportRequestData, CreateTransportRequestVariables, UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables, AssignVehicleToRequestData, AssignVehicleToRequestVariables, RegisterVehicleData, RegisterVehicleVariables, UpdateVehicleStatusData, UpdateVehicleStatusVariables, UpdateVehicleLocationData, UpdateVehicleLocationVariables, CreateDispatchData, CreateDispatchVariables, UpdateDispatchStatusData, UpdateDispatchStatusVariables, DeleteTransportRequestData, DeleteTransportRequestVariables, ListTransportRequestsData, GetTransportRequestByIdData, GetTransportRequestByIdVariables, ListVehiclesData, GetAvailableVehiclesData, GetVehicleByIdData, GetVehicleByIdVariables, ListDispatchesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateTransportRequest(options?: useDataConnectMutationOptions<CreateTransportRequestData, FirebaseError, CreateTransportRequestVariables>): UseDataConnectMutationResult<CreateTransportRequestData, CreateTransportRequestVariables>;
export function useCreateTransportRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTransportRequestData, FirebaseError, CreateTransportRequestVariables>): UseDataConnectMutationResult<CreateTransportRequestData, CreateTransportRequestVariables>;

export function useUpdateTransportRequestStatus(options?: useDataConnectMutationOptions<UpdateTransportRequestStatusData, FirebaseError, UpdateTransportRequestStatusVariables>): UseDataConnectMutationResult<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;
export function useUpdateTransportRequestStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTransportRequestStatusData, FirebaseError, UpdateTransportRequestStatusVariables>): UseDataConnectMutationResult<UpdateTransportRequestStatusData, UpdateTransportRequestStatusVariables>;

export function useAssignVehicleToRequest(options?: useDataConnectMutationOptions<AssignVehicleToRequestData, FirebaseError, AssignVehicleToRequestVariables>): UseDataConnectMutationResult<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;
export function useAssignVehicleToRequest(dc: DataConnect, options?: useDataConnectMutationOptions<AssignVehicleToRequestData, FirebaseError, AssignVehicleToRequestVariables>): UseDataConnectMutationResult<AssignVehicleToRequestData, AssignVehicleToRequestVariables>;

export function useRegisterVehicle(options?: useDataConnectMutationOptions<RegisterVehicleData, FirebaseError, RegisterVehicleVariables>): UseDataConnectMutationResult<RegisterVehicleData, RegisterVehicleVariables>;
export function useRegisterVehicle(dc: DataConnect, options?: useDataConnectMutationOptions<RegisterVehicleData, FirebaseError, RegisterVehicleVariables>): UseDataConnectMutationResult<RegisterVehicleData, RegisterVehicleVariables>;

export function useUpdateVehicleStatus(options?: useDataConnectMutationOptions<UpdateVehicleStatusData, FirebaseError, UpdateVehicleStatusVariables>): UseDataConnectMutationResult<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;
export function useUpdateVehicleStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleStatusData, FirebaseError, UpdateVehicleStatusVariables>): UseDataConnectMutationResult<UpdateVehicleStatusData, UpdateVehicleStatusVariables>;

export function useUpdateVehicleLocation(options?: useDataConnectMutationOptions<UpdateVehicleLocationData, FirebaseError, UpdateVehicleLocationVariables>): UseDataConnectMutationResult<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;
export function useUpdateVehicleLocation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVehicleLocationData, FirebaseError, UpdateVehicleLocationVariables>): UseDataConnectMutationResult<UpdateVehicleLocationData, UpdateVehicleLocationVariables>;

export function useCreateDispatch(options?: useDataConnectMutationOptions<CreateDispatchData, FirebaseError, CreateDispatchVariables>): UseDataConnectMutationResult<CreateDispatchData, CreateDispatchVariables>;
export function useCreateDispatch(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDispatchData, FirebaseError, CreateDispatchVariables>): UseDataConnectMutationResult<CreateDispatchData, CreateDispatchVariables>;

export function useUpdateDispatchStatus(options?: useDataConnectMutationOptions<UpdateDispatchStatusData, FirebaseError, UpdateDispatchStatusVariables>): UseDataConnectMutationResult<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;
export function useUpdateDispatchStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDispatchStatusData, FirebaseError, UpdateDispatchStatusVariables>): UseDataConnectMutationResult<UpdateDispatchStatusData, UpdateDispatchStatusVariables>;

export function useDeleteTransportRequest(options?: useDataConnectMutationOptions<DeleteTransportRequestData, FirebaseError, DeleteTransportRequestVariables>): UseDataConnectMutationResult<DeleteTransportRequestData, DeleteTransportRequestVariables>;
export function useDeleteTransportRequest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTransportRequestData, FirebaseError, DeleteTransportRequestVariables>): UseDataConnectMutationResult<DeleteTransportRequestData, DeleteTransportRequestVariables>;

export function useListTransportRequests(options?: useDataConnectQueryOptions<ListTransportRequestsData>): UseDataConnectQueryResult<ListTransportRequestsData, undefined>;
export function useListTransportRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListTransportRequestsData>): UseDataConnectQueryResult<ListTransportRequestsData, undefined>;

export function useGetTransportRequestById(vars: GetTransportRequestByIdVariables, options?: useDataConnectQueryOptions<GetTransportRequestByIdData>): UseDataConnectQueryResult<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;
export function useGetTransportRequestById(dc: DataConnect, vars: GetTransportRequestByIdVariables, options?: useDataConnectQueryOptions<GetTransportRequestByIdData>): UseDataConnectQueryResult<GetTransportRequestByIdData, GetTransportRequestByIdVariables>;

export function useListVehicles(options?: useDataConnectQueryOptions<ListVehiclesData>): UseDataConnectQueryResult<ListVehiclesData, undefined>;
export function useListVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<ListVehiclesData>): UseDataConnectQueryResult<ListVehiclesData, undefined>;

export function useGetAvailableVehicles(options?: useDataConnectQueryOptions<GetAvailableVehiclesData>): UseDataConnectQueryResult<GetAvailableVehiclesData, undefined>;
export function useGetAvailableVehicles(dc: DataConnect, options?: useDataConnectQueryOptions<GetAvailableVehiclesData>): UseDataConnectQueryResult<GetAvailableVehiclesData, undefined>;

export function useGetVehicleById(vars: GetVehicleByIdVariables, options?: useDataConnectQueryOptions<GetVehicleByIdData>): UseDataConnectQueryResult<GetVehicleByIdData, GetVehicleByIdVariables>;
export function useGetVehicleById(dc: DataConnect, vars: GetVehicleByIdVariables, options?: useDataConnectQueryOptions<GetVehicleByIdData>): UseDataConnectQueryResult<GetVehicleByIdData, GetVehicleByIdVariables>;

export function useListDispatches(options?: useDataConnectQueryOptions<ListDispatchesData>): UseDataConnectQueryResult<ListDispatchesData, undefined>;
export function useListDispatches(dc: DataConnect, options?: useDataConnectQueryOptions<ListDispatchesData>): UseDataConnectQueryResult<ListDispatchesData, undefined>;
