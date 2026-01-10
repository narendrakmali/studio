import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeMutation } from 'firebase/data-connect';
import { getServerDataConnect } from '@/firebase/server-dataconnect';

/**
 * API endpoint for vehicles
 * GET /api/vehicles - List all vehicles
 * POST /api/vehicles - Register a new vehicle
 */

// Initialize Firebase Data Connect for server-side
function getDataConnectInstance() {
  return getServerDataConnect();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    // Use GetAvailableVehicles if status=available, otherwise ListVehicles
    const queryName = status === 'available' ? 'GetAvailableVehicles' : 'ListVehicles';
    const queryRef = {
      refType: 'query' as const,
      name: queryName,
      dataConnect: dc,
    };
    
    const result = await executeQuery(queryRef);
    let vehicles = result.data?.vehicles || [];
    
    // Filter by type if provided
    if (type) {
      vehicles = vehicles.filter((vehicle: any) => vehicle.type === type);
    }
    
    // Filter by status if provided and not using GetAvailableVehicles
    if (status && queryName !== 'GetAvailableVehicles') {
      vehicles = vehicles.filter((vehicle: any) => vehicle.status === status);
    }
    
    return NextResponse.json({
      success: true,
      data: vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'vehicleNumber',
      'type',
      'model',
      'capacity',
      'driverName',
      'driverPhone',
    ];
    
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

    const mutationRef = {
      refType: 'mutation' as const,
      name: 'RegisterVehicle',
      dataConnect: dc,
    };
    
    const result = await executeMutation(mutationRef, {
      vehicleNumber: body.vehicleNumber,
      type: body.type,
      model: body.model,
      capacity: body.capacity,
      driverName: body.driverName,
      driverPhone: body.driverPhone,
      driverLicense: body.driverLicense || null,
      currentLocation: body.currentLocation || null,
      imageUrl: body.imageUrl || null,
    });
    
    return NextResponse.json({
      success: true,
      data: result.data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error registering vehicle:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register vehicle',
      },
      { status: 500 }
    );
  }
}
