
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
  contractStartDate?: Date;
  contractEndDate?: Date;
};

export type TransportRequest = {
  id: string;
  userName: string;
  contactNumber: string;
  departmentName: string;
  status: 'pending' | 'allocated' | 'dispatched' | 'completed';
  createdAt: Date;
  hodApprovalImage?: string;
  
  // Fields for different request types
  requestType: 'private' | 'bus' | 'train';

  // Private Vehicle fields
  vehicleType?: 'two-wheeler' | 'car' | 'suv' | 'winger' | 'innova';
  registrationNumber?: string;
  passengerCount?: number;
  driverName?: string;
  driverContact?: string;
  durationFrom?: Date;
  durationTo?: Date;
  destination?: string;

  // Bus fields
  busType?: 'private' | 'msrtc';
  busQuantity?: number;
  busRoute?: string;
  busCoordinatorName?: string;
  busCoordinatorContact?: string;
  busBookingReceipt?: any;
  
  // Train fields
  trainTeamLeaderName?: string;
  trainTeamLeaderContact?: string;
  trainNumber?: string;
  trainArrivalDate?: Date;
  trainDevoteeCount?: number;
  pickupRequired?: boolean;
  returnTrainNumber?: string;
  returnTrainDepartureDate?: Date;
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

    