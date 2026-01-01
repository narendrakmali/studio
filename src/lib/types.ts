export type Vehicle = {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  images: {
    front: string;
    side: string;
    odometer: string;
  };
  lastTripDestination?: string;
};

export type TransportRequest = {
  id: string;
  departmentName: string;
  passengerCount: number;
  destination: string;
  hodApprovalImage: string;
  status: 'pending' | 'allocated' | 'dispatched' | 'completed';
  createdAt: Date;
};

export type Dispatch = {
  id: string;
  requestId: string;
  vehicleId: string;
  driverName: string;
  driverLicense: string;
  conditionPhoto: string;
  dispatchedAt: Date;
};
