import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeMutation } from 'firebase/data-connect';
import { getServerDataConnect } from '@/firebase/server-dataconnect';

/**
 * API endpoint for dispatch operations
 * GET /api/dispatch - List all dispatches
 * POST /api/dispatch - Create a new dispatch (assign vehicle to request)
 */

// Initialize Firebase Data Connect for server-side
function getDataConnectInstance() {
  return getServerDataConnect();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const vehicleId = searchParams.get('vehicleId');
    const requestId = searchParams.get('requestId');
    
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    const queryRef = {
      refType: 'query' as const,
      name: 'ListDispatches',
      dataConnect: dc,
    };
    
    const result = await executeQuery(queryRef);
    let dispatches = result.data?.dispatches || [];
    
    // Filter by status if provided
    if (status) {
      dispatches = dispatches.filter((d: any) => d.status === status);
    }
    
    // Filter by vehicle ID if provided
    if (vehicleId) {
      dispatches = dispatches.filter((d: any) => d.vehicleId === vehicleId);
    }
    
    // Filter by request ID if provided
    if (requestId) {
      dispatches = dispatches.filter((d: any) => d.requestId === requestId);
    }
    
    return NextResponse.json({
      success: true,
      data: dispatches,
      count: dispatches.length,
    });
  } catch (error) {
    console.error('Error fetching dispatches:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dispatches',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['requestId', 'vehicleId'];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }
    
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    // Step 1: Create dispatch record
    const createDispatchRef = {
      refType: 'mutation' as const,
      name: 'CreateDispatch',
      dataConnect: dc,
    };
    
    const dispatchResult = await executeMutation(createDispatchRef, {
      requestId: body.requestId,
      vehicleId: body.vehicleId,
      estimatedArrival: body.estimatedArrival || null,
      notes: body.notes || null,
      dispatchedBy: body.dispatchedBy || null,
    });
    
    // Step 2: Update request with assigned vehicle
    const assignVehicleRef = {
      refType: 'mutation' as const,
      name: 'AssignVehicleToRequest',
      dataConnect: dc,
    };
    
    await executeMutation(assignVehicleRef, {
      requestId: body.requestId,
      vehicleId: body.vehicleId,
    });
    
    // Step 3: Update vehicle status to in_use
    const updateVehicleRef = {
      refType: 'mutation' as const,
      name: 'UpdateVehicleStatus',
      dataConnect: dc,
    };
    
    await executeMutation(updateVehicleRef, {
      id: body.vehicleId,
      status: 'in_use',
    });
    
    return NextResponse.json({
      success: true,
      data: dispatchResult.data,
      message: 'Vehicle dispatched successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating dispatch:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create dispatch',
      },
      { status: 500 }
    );
  }
}
