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
  userName: string;
  contactNumber: string;
  departmentName: string;
  vehicleType: 'two-wheeler' | 'four-wheeler';
  durationFrom: Date;
  durationTo: Date;
  status: 'pending' | 'allocated' | 'dispatched' | 'completed';
  createdAt: Date;
  hodApprovalImage?: string; // Made optional
  passengerCount?: number; // Made optional
  destination?: string; // Made optional
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

    