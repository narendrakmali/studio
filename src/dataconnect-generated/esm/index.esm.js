import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};

export const createTransportRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTransportRequest', inputVars);
}
createTransportRequestRef.operationName = 'CreateTransportRequest';

export function createTransportRequest(dcOrVars, vars) {
  return executeMutation(createTransportRequestRef(dcOrVars, vars));
}

export const updateTransportRequestStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTransportRequestStatus', inputVars);
}
updateTransportRequestStatusRef.operationName = 'UpdateTransportRequestStatus';

export function updateTransportRequestStatus(dcOrVars, vars) {
  return executeMutation(updateTransportRequestStatusRef(dcOrVars, vars));
}

export const assignVehicleToRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignVehicleToRequest', inputVars);
}
assignVehicleToRequestRef.operationName = 'AssignVehicleToRequest';

export function assignVehicleToRequest(dcOrVars, vars) {
  return executeMutation(assignVehicleToRequestRef(dcOrVars, vars));
}

export const registerVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterVehicle', inputVars);
}
registerVehicleRef.operationName = 'RegisterVehicle';

export function registerVehicle(dcOrVars, vars) {
  return executeMutation(registerVehicleRef(dcOrVars, vars));
}

export const updateVehicleStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicleStatus', inputVars);
}
updateVehicleStatusRef.operationName = 'UpdateVehicleStatus';

export function updateVehicleStatus(dcOrVars, vars) {
  return executeMutation(updateVehicleStatusRef(dcOrVars, vars));
}

export const updateVehicleLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicleLocation', inputVars);
}
updateVehicleLocationRef.operationName = 'UpdateVehicleLocation';

export function updateVehicleLocation(dcOrVars, vars) {
  return executeMutation(updateVehicleLocationRef(dcOrVars, vars));
}

export const createDispatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDispatch', inputVars);
}
createDispatchRef.operationName = 'CreateDispatch';

export function createDispatch(dcOrVars, vars) {
  return executeMutation(createDispatchRef(dcOrVars, vars));
}

export const updateDispatchStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDispatchStatus', inputVars);
}
updateDispatchStatusRef.operationName = 'UpdateDispatchStatus';

export function updateDispatchStatus(dcOrVars, vars) {
  return executeMutation(updateDispatchStatusRef(dcOrVars, vars));
}

export const deleteTransportRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTransportRequest', inputVars);
}
deleteTransportRequestRef.operationName = 'DeleteTransportRequest';

export function deleteTransportRequest(dcOrVars, vars) {
  return executeMutation(deleteTransportRequestRef(dcOrVars, vars));
}

export const listTransportRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTransportRequests');
}
listTransportRequestsRef.operationName = 'ListTransportRequests';

export function listTransportRequests(dc) {
  return executeQuery(listTransportRequestsRef(dc));
}

export const getTransportRequestByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTransportRequestById', inputVars);
}
getTransportRequestByIdRef.operationName = 'GetTransportRequestById';

export function getTransportRequestById(dcOrVars, vars) {
  return executeQuery(getTransportRequestByIdRef(dcOrVars, vars));
}

export const listVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVehicles');
}
listVehiclesRef.operationName = 'ListVehicles';

export function listVehicles(dc) {
  return executeQuery(listVehiclesRef(dc));
}

export const getAvailableVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableVehicles');
}
getAvailableVehiclesRef.operationName = 'GetAvailableVehicles';

export function getAvailableVehicles(dc) {
  return executeQuery(getAvailableVehiclesRef(dc));
}

export const getVehicleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehicleById', inputVars);
}
getVehicleByIdRef.operationName = 'GetVehicleById';

export function getVehicleById(dcOrVars, vars) {
  return executeQuery(getVehicleByIdRef(dcOrVars, vars));
}

export const listDispatchesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDispatches');
}
listDispatchesRef.operationName = 'ListDispatches';

export function listDispatches(dc) {
  return executeQuery(listDispatchesRef(dc));
}

