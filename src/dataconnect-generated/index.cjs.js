const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createTransportRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTransportRequest', inputVars);
}
createTransportRequestRef.operationName = 'CreateTransportRequest';
exports.createTransportRequestRef = createTransportRequestRef;

exports.createTransportRequest = function createTransportRequest(dcOrVars, vars) {
  return executeMutation(createTransportRequestRef(dcOrVars, vars));
};

const updateTransportRequestStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTransportRequestStatus', inputVars);
}
updateTransportRequestStatusRef.operationName = 'UpdateTransportRequestStatus';
exports.updateTransportRequestStatusRef = updateTransportRequestStatusRef;

exports.updateTransportRequestStatus = function updateTransportRequestStatus(dcOrVars, vars) {
  return executeMutation(updateTransportRequestStatusRef(dcOrVars, vars));
};

const assignVehicleToRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignVehicleToRequest', inputVars);
}
assignVehicleToRequestRef.operationName = 'AssignVehicleToRequest';
exports.assignVehicleToRequestRef = assignVehicleToRequestRef;

exports.assignVehicleToRequest = function assignVehicleToRequest(dcOrVars, vars) {
  return executeMutation(assignVehicleToRequestRef(dcOrVars, vars));
};

const registerVehicleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterVehicle', inputVars);
}
registerVehicleRef.operationName = 'RegisterVehicle';
exports.registerVehicleRef = registerVehicleRef;

exports.registerVehicle = function registerVehicle(dcOrVars, vars) {
  return executeMutation(registerVehicleRef(dcOrVars, vars));
};

const updateVehicleStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicleStatus', inputVars);
}
updateVehicleStatusRef.operationName = 'UpdateVehicleStatus';
exports.updateVehicleStatusRef = updateVehicleStatusRef;

exports.updateVehicleStatus = function updateVehicleStatus(dcOrVars, vars) {
  return executeMutation(updateVehicleStatusRef(dcOrVars, vars));
};

const updateVehicleLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateVehicleLocation', inputVars);
}
updateVehicleLocationRef.operationName = 'UpdateVehicleLocation';
exports.updateVehicleLocationRef = updateVehicleLocationRef;

exports.updateVehicleLocation = function updateVehicleLocation(dcOrVars, vars) {
  return executeMutation(updateVehicleLocationRef(dcOrVars, vars));
};

const createDispatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDispatch', inputVars);
}
createDispatchRef.operationName = 'CreateDispatch';
exports.createDispatchRef = createDispatchRef;

exports.createDispatch = function createDispatch(dcOrVars, vars) {
  return executeMutation(createDispatchRef(dcOrVars, vars));
};

const updateDispatchStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDispatchStatus', inputVars);
}
updateDispatchStatusRef.operationName = 'UpdateDispatchStatus';
exports.updateDispatchStatusRef = updateDispatchStatusRef;

exports.updateDispatchStatus = function updateDispatchStatus(dcOrVars, vars) {
  return executeMutation(updateDispatchStatusRef(dcOrVars, vars));
};

const deleteTransportRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTransportRequest', inputVars);
}
deleteTransportRequestRef.operationName = 'DeleteTransportRequest';
exports.deleteTransportRequestRef = deleteTransportRequestRef;

exports.deleteTransportRequest = function deleteTransportRequest(dcOrVars, vars) {
  return executeMutation(deleteTransportRequestRef(dcOrVars, vars));
};

const listTransportRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTransportRequests');
}
listTransportRequestsRef.operationName = 'ListTransportRequests';
exports.listTransportRequestsRef = listTransportRequestsRef;

exports.listTransportRequests = function listTransportRequests(dc) {
  return executeQuery(listTransportRequestsRef(dc));
};

const getTransportRequestByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTransportRequestById', inputVars);
}
getTransportRequestByIdRef.operationName = 'GetTransportRequestById';
exports.getTransportRequestByIdRef = getTransportRequestByIdRef;

exports.getTransportRequestById = function getTransportRequestById(dcOrVars, vars) {
  return executeQuery(getTransportRequestByIdRef(dcOrVars, vars));
};

const listVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListVehicles');
}
listVehiclesRef.operationName = 'ListVehicles';
exports.listVehiclesRef = listVehiclesRef;

exports.listVehicles = function listVehicles(dc) {
  return executeQuery(listVehiclesRef(dc));
};

const getAvailableVehiclesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableVehicles');
}
getAvailableVehiclesRef.operationName = 'GetAvailableVehicles';
exports.getAvailableVehiclesRef = getAvailableVehiclesRef;

exports.getAvailableVehicles = function getAvailableVehicles(dc) {
  return executeQuery(getAvailableVehiclesRef(dc));
};

const getVehicleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVehicleById', inputVars);
}
getVehicleByIdRef.operationName = 'GetVehicleById';
exports.getVehicleByIdRef = getVehicleByIdRef;

exports.getVehicleById = function getVehicleById(dcOrVars, vars) {
  return executeQuery(getVehicleByIdRef(dcOrVars, vars));
};

const listDispatchesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDispatches');
}
listDispatchesRef.operationName = 'ListDispatches';
exports.listDispatchesRef = listDispatchesRef;

exports.listDispatches = function listDispatches(dc) {
  return executeQuery(listDispatchesRef(dc));
};
