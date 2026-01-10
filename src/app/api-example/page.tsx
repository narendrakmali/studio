'use client';

/**
 * Example component demonstrating API usage
 * This shows how to use the API client and hooks in a real component
 */

import { useState } from 'react';
import { useRequests, useVehicles, useMutation } from '@/hooks/use-api';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApiExamplePage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  // Fetch all pending requests
  const { data: requests, loading: requestsLoading, error: requestsError, refetch } = useRequests({ 
    status: 'pending' 
  });
  
  // Fetch available vehicles
  const { data: vehicles, loading: vehiclesLoading } = useVehicles({ 
    status: 'available' 
  });
  
  // Mutation for creating a dispatch
  const { mutate: createDispatch, loading: dispatchLoading } = useMutation(
    apiClient.createDispatch.bind(apiClient)
  );
  
  // Mutation for creating a request
  const { mutate: createRequest, loading: createLoading } = useMutation(
    apiClient.createRequest.bind(apiClient)
  );

  const handleCreateTestRequest = async () => {
    const { data, error } = await createRequest({
      passengerName: "Test User",
      department: "Engineering",
      purpose: "Testing API",
      pickupLocation: "Office A",
      dropLocation: "Office B",
      scheduledTime: new Date().toISOString(),
      requestType: "indoor",
    });

    if (error) {
      alert('Failed to create request: ' + error);
    } else {
      alert('Request created successfully!');
      refetch();
    }
  };

  const handleAssignVehicle = async (requestId: string, vehicleId: string) => {
    const { error } = await createDispatch({ requestId, vehicleId });
    
    if (error) {
      alert('Failed to assign vehicle: ' + error);
    } else {
      alert('Vehicle assigned successfully!');
      refetch();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">API Connection Example</h1>
        <div className="space-x-2">
          <Button onClick={handleCreateTestRequest} disabled={createLoading}>
            {createLoading ? 'Creating...' : 'Create Test Request'}
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requests Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              {requestsLoading ? 'Loading...' : `${requests?.length || 0} requests`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requestsError && (
              <div className="text-red-500 p-4 bg-red-50 rounded">
                Error: {requestsError}
              </div>
            )}
            
            {requestsLoading && (
              <div className="text-gray-500">Loading requests...</div>
            )}
            
            {!requestsLoading && requests && requests.length === 0 && (
              <div className="text-gray-500">No pending requests</div>
            )}
            
            {requests && requests.length > 0 && (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div 
                    key={request.id}
                    className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRequest(
                      selectedRequest === request.id ? null : request.id
                    )}
                  >
                    <div className="font-semibold">{request.passengerName}</div>
                    <div className="text-sm text-gray-600">
                      {request.pickupLocation} → {request.dropLocation}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {request.department} • {request.priority}
                    </div>
                    
                    {selectedRequest === request.id && (
                      <div className="mt-3 pt-3 border-t">
                        <select
                          className="w-full p-2 border rounded"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignVehicle(request.id, e.target.value);
                            }
                          }}
                          disabled={dispatchLoading || vehiclesLoading}
                        >
                          <option value="">Select vehicle to assign</option>
                          {vehicles?.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.vehicleNumber} - {v.driverName}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicles Section */}
        <Card>
          <CardHeader>
            <CardTitle>Available Vehicles</CardTitle>
            <CardDescription>
              {vehiclesLoading ? 'Loading...' : `${vehicles?.length || 0} vehicles`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehiclesLoading && (
              <div className="text-gray-500">Loading vehicles...</div>
            )}
            
            {!vehiclesLoading && vehicles && vehicles.length === 0 && (
              <div className="text-gray-500">No vehicles available</div>
            )}
            
            {vehicles && vehicles.length > 0 && (
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <div 
                    key={vehicle.id}
                    className="p-4 border rounded"
                  >
                    <div className="font-semibold">{vehicle.vehicleNumber}</div>
                    <div className="text-sm text-gray-600">
                      {vehicle.model} • {vehicle.type}
                    </div>
                    <div className="text-sm text-gray-600">
                      Driver: {vehicle.driverName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Capacity: {vehicle.capacity} • Status: {vehicle.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Available API routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div>GET /api/requests - List requests</div>
            <div>POST /api/requests - Create request</div>
            <div>GET /api/vehicles - List vehicles</div>
            <div>POST /api/vehicles - Register vehicle</div>
            <div>POST /api/dispatch - Assign vehicle</div>
            <div>GET /api/test-connection - Test connection</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
