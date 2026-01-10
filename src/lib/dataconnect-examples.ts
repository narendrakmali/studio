/**
 * Example usage of Firebase Data Connect SDK
 * 
 * This file demonstrates how to use the generated SDK
 * for common transport management operations.
 */

import {
  // Queries
  listTransportRequests,
  getTransportRequestById,
  listVehicles,
  getAvailableVehicles,
  getVehicleById,
  listDispatches,
  
  // Mutations
  createTransportRequest,
  updateTransportRequestStatus,
  assignVehicleToRequest,
  registerVehicle,
  updateVehicleStatus,
  updateVehicleLocation,
  createDispatch,
  updateDispatchStatus,
  deleteTransportRequest,
} from '@dataconnect/generated';

/**
 * Example 1: Create a new transport request
 */
export async function exampleCreateRequest() {
  try {
    const result = await createTransportRequest({
      passengerName: 'John Doe',
      department: 'Engineering',
      purpose: 'Client Meeting',
      phoneNumber: '+1234567890',
      employeeId: 'EMP001',
      pickupLocation: 'Building A, Floor 3',
      dropLocation: 'Downtown Conference Center',
      scheduledTime: new Date('2026-01-08T10:00:00').toISOString(),
      priority: 'high',
      numberOfPassengers: 2,
      requestType: 'outdoor',
      specialRequirements: 'Need wheelchair accessible vehicle',
    });
    
    console.log('✅ Request created:', result.data.transportRequest_insert);
    return result.data.transportRequest_insert;
  } catch (error) {
    console.error('❌ Error creating request:', error);
    throw error;
  }
}

/**
 * Example 2: List all transport requests
 */
export async function exampleListRequests() {
  try {
    const result = await listTransportRequests();
    console.log('📋 All requests:', result.data.transportRequests);
    return result.data.transportRequests;
  } catch (error) {
    console.error('❌ Error listing requests:', error);
    throw error;
  }
}

/**
 * Example 3: Register a new vehicle
 */
export async function exampleRegisterVehicle() {
  try {
    const result = await registerVehicle({
      vehicleNumber: 'KA-01-AB-1234',
      type: 'sedan',
      model: 'Toyota Camry',
      capacity: 4,
      driverName: 'Rajesh Kumar',
      driverPhone: '+919876543210',
      driverLicense: 'KA0120230012345',
      imageUrl: 'https://example.com/vehicle.jpg',
      currentLocation: 'Main Garage',
    });
    
    console.log('✅ Vehicle registered:', result.data.vehicle_insert);
    return result.data.vehicle_insert;
  } catch (error) {
    console.error('❌ Error registering vehicle:', error);
    throw error;
  }
}

/**
 * Example 4: Assign vehicle to request
 */
export async function exampleAssignVehicle(requestId: string, vehicleId: string) {
  try {
    // First assign the vehicle to the request
    await assignVehicleToRequest({
      requestId,
      vehicleId,
    });
    
    // Update request status
    await updateTransportRequestStatus({
      id: requestId,
      status: 'assigned',
    });
    
    // Update vehicle status
    await updateVehicleStatus({
      id: vehicleId,
      status: 'in_use',
    });
    
    // Create dispatch record
    const dispatch = await createDispatch({
      requestId,
      vehicleId,
      estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      notes: 'Driver notified, en route to pickup location',
      dispatchedBy: 'dispatcher@example.com',
    });
    
    console.log('✅ Vehicle assigned and dispatched:', dispatch.data.dispatch_insert);
    return dispatch.data.dispatch_insert;
  } catch (error) {
    console.error('❌ Error assigning vehicle:', error);
    throw error;
  }
}

/**
 * Example 5: Get available vehicles
 */
export async function exampleGetAvailableVehicles() {
  try {
    const result = await getAvailableVehicles();
    console.log('🚗 Available vehicles:', result.data.vehicles);
    return result.data.vehicles;
  } catch (error) {
    console.error('❌ Error getting available vehicles:', error);
    throw error;
  }
}

/**
 * Example 6: Update dispatch status (complete journey)
 */
export async function exampleCompleteDispatch(dispatchId: string) {
  try {
    const now = new Date().toISOString();
    
    const result = await updateDispatchStatus({
      id: dispatchId,
      status: 'completed',
      actualArrival: now,
      completedAt: now,
    });
    
    console.log('✅ Dispatch completed:', result.data.dispatch_update);
    return result.data.dispatch_update;
  } catch (error) {
    console.error('❌ Error completing dispatch:', error);
    throw error;
  }
}

/**
 * Example 7: Real-time polling for requests (React component)
 */
export function useTransportRequests() {
  // In a React component, you can poll for updates:
  /*
  import { useState, useEffect } from 'react';
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const result = await listTransportRequests();
        setRequests(result.data.transportRequests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    
    fetchRequests();
    
    // Poll every 2 seconds
    const interval = setInterval(fetchRequests, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { requests, loading };
  */
}

/**
 * Example 8: Using with React Query for better caching
 */
export function setupReactQuery() {
  /*
  import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
  
  const queryClient = new QueryClient();
  
  function TransportRequestsComponent() {
    const { data, isLoading, error } = useQuery({
      queryKey: ['transportRequests'],
      queryFn: async () => {
        const result = await listTransportRequests();
        return result.data.transportRequests;
      },
      refetchInterval: 2000, // Poll every 2 seconds
    });
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
      <div>
        {data?.map(request => (
          <div key={request.id}>{request.passengerName}</div>
        ))}
      </div>
    );
  }
  */
}

// Export all functions for easy import
export default {
  exampleCreateRequest,
  exampleListRequests,
  exampleRegisterVehicle,
  exampleAssignVehicle,
  exampleGetAvailableVehicles,
  exampleCompleteDispatch,
};
