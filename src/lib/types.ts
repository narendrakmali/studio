export type Vehicle = {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  capacity: number;
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  images: {
    front: string;
    side: string;
    odometer: string;
  };
  lastTripDestination?: string;
  ownerName: string;
  ownerContact: string;
  ownerAddress: string;
};

export type TransportRequest = {
  id: string;
  userName: string;
  contactNumber: string;
  departmentName: string;
  vehicleType: 'two-wheeler' | 'four-wheeler' | 'tempo' | 'eicher' | 'bus';
  durationFrom: Date;
  durationTo: Date;
  status: 'pending' | 'allocated' | 'dispatched' | 'completed';
  createdAt: Date;
  hodApprovalImage?: string;
  passengerCount: number;
  destination?: string;
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
