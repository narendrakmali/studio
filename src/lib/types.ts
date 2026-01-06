

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
  source: 'indoor' | 'outdoor'; // To distinguish request origin
  userName: string;
  contactNumber: string;
  departmentName: string; // This can be department or Branch/Zone
  status: 'pending' | 'allocated' | 'dispatched' | 'completed';
  createdAt: Date;
  hodApprovalImage?: string;
  
  // Fields for different request types
  requestType: 'private' | 'bus' | 'train' | 'airport';

  // Private Vehicle fields (used by both indoor and outdoor)
  vehicleType?: 'two-wheeler' | 'car' | 'suv' | 'winger' | 'innova' | 'four-wheeler' | 'tempo' | 'eicher' | 'bus';
  registrationNumber?: string;
  passengerCount?: number;
  driverName?: string;
  driverContact?: string;
  durationFrom?: Date;
  durationTo?: Date;
  destination?: string;

  // Bus fields (outdoor only)
  busType?: 'private' | 'msrtc';
  busQuantity?: number;
  busRoute?: string;
  busCoordinatorName?: string;
  busCoordinatorContact?: string;
  busBookingReceipt?: any;
  
  // Train fields (outdoor only)
  trainTeamLeaderName?: string;
  trainTeamLeaderContact?: string;
  trainNumber?: string;
  trainArrivalDate?: Date;
  trainDevoteeCount?: number;
  pickupRequired?: boolean;
  returnTrainNumber?: string;
  returnTrainDepartureDate?: Date;
  
  // Airport fields (outdoor only)
  airportName?: 'pune' | 'kolhapur';
  flightNumber?: string;
  arrivalDate?: Date;
  arrivalTime?: string;
  returnFlightNumber?: string;
  departureDate?: Date;
  departureTime?: string;
  
  // Additional train arrival fields
  zone?: string;
  unitNo?: string;
  officialName?: string;
  trainDetails?: string;
  departureDate?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  sevadalCount?: string;
  returnDate?: string;
  returnStation?: string;
  returnTime?: string;
  userPhone?: string;
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

    
    