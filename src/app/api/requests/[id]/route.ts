import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeMutation } from 'firebase/data-connect';
import { getServerDataConnect } from '@/firebase/server-dataconnect';

/**
 * API endpoint for individual transport request operations
 * GET /api/requests/[id] - Get a specific request
 * PATCH /api/requests/[id] - Update a specific request
 * DELETE /api/requests/[id] - Delete a specific request
 */

// Initialize Firebase Data Connect for server-side
function getDataConnectInstance() {
  return getServerDataConnect();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    const queryRef = {
      refType: 'query' as const,
      name: 'GetTransportRequestById',
      dataConnect: dc,
    };
    
    const result = await executeQuery(queryRef, { id });
    
    if (!result.data?.transportRequest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result.data.transportRequest,
    });
  } const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    // If updating status specifically
    if (body.status) {
      const mutationRef = {
        refType: 'mutation' as const,
        name: 'UpdateTransportRequestStatus',
        dataConnect: dc,
      };
      
      const result = await executeMutation(mutationRef, {
        id,
        status: body.status,
      });
      
      return NextResponse.json({
        success: true,
        data: result.data,
      });
    }
    
    // For other updates, return error for now (add more specific mutations as needed)
    return NextResponse.json(
      {
        success: false,
        error: 'Only status updates are currently supported. Please add specific mutation for other fields.',
      },
      { status: 400 }
    f (requestIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found',
        },
        { status: 404 }
      );
    }
    
    // Update the request
    requestsCache[requestIndex] = {
      ...requestsCache[requestIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    const dc = getDataConnectInstance();
    if (!dc) {
      throw new Error('Data Connect not available');
    }

    const mutationRef = {
      refType: 'mutation' as const,
      name: 'DeleteTransportRequest',
      dataConnect: dc,
    };
    
    await executeMutation(mutationRef, { id }
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // TODO: Replace with actual Data Connect mutation
    // await executeMutation(connectorConfig, DeleteTransportRequest, { id });
    
    const requestIndex = requestsCache.findIndex(req => req.id === id);
    
    if (requestIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request not found',
        },
        { status: 404 }
      );
    }
    
    requestsCache.splice(requestIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete request',
      },
      { status: 500 }
    );
  }
}
