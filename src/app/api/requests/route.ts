import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeMutation } from 'firebase/data-connect';
import { getServerDataConnect } from '@/firebase/server-dataconnect';

/**
 * API endpoint for transport requests
 * GET /api/requests - List all transport requests
 * POST /api/requests - Create a new transport request
 */

// Initialize Firebase Data Connect for server-side
function getDataConnectInstance() {
  return getServerDataConnect();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const requestType = searchParams.get('requestType');
    
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    // Execute the ListTransportRequests query
    const queryRef = {
      refType: 'query' as const,
      name: 'ListTransportRequests',
      dataConnect: dc,
    };
    
    const result = await executeQuery(queryRef);
    let requests = result.data?.transportRequests || [];
    
    // Filter by status if provided
    if (status) {
      requests = requests.filter((req: any) => req.status === status);
    }
    
    // Filter by request type if provided
    if (requestType) {
      requests = requests.filter((req: any) => req.requestType === requestType);
    }
    
    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Error fetching transport requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch requests',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    // Execute the CreateTransportRequest mutation
    const mutationRef = {
      refType: 'mutation' as const,
      name: 'CreateTransportRequest',
      dataConnect: dc,
    };
    
    const result = await executeMutation(mutationRef, {
      passengerName: body.passengerName,
      department: body.department,
      purpose: body.purpose,
      phoneNumber: body.phoneNumber || null,
      employeeId: body.employeeId || null,
      pickupLocation: body.pickupLocation,
      dropLocation: body.dropLocation,
      scheduledTime: body.scheduledTime,
      priority: body.priority || null,
      specialRequirements: body.specialRequirements || null,
      numberOfPassengers: body.numberOfPassengers || null,
      estimatedDistance: body.estimatedDistance || null,
      requestType: body.requestType || null,
    });
    
    return NextResponse.json({
      success: true,
      data: result.data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transport request:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create request',
      },
      { status: 500 }
    );
  }
}
