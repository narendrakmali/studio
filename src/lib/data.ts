import type { Vehicle, TransportRequest, Dispatch } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const vehicles: Vehicle[] = [
    {
    id: 'V001',
    licensePlate: 'MH12AB1234',
    make: 'Toyota',
    model: 'Innova',
    capacity: 7,
    status: 'available',
    location: 'Main Parking',
    images: {
      front: PlaceHolderImages.find((img) => img.id === 'vehicle-front-1')?.imageUrl || '',
      side: PlaceHolderImages.find((img) => img.id === 'vehicle-side-1')?.imageUrl || '',
      odometer: PlaceHolderImages.find((img) => img.id === 'odometer-1')?.imageUrl || '',
    },
    ownerName: "Samagam Services",
    ownerContact: "9988776655",
    ownerAddress: "123, Main Road, Pune",
  },
  {
    id: 'V002',
    licensePlate: 'MH14CD5678',
    make: 'Maruti',
    model: 'Ertiga',
    capacity: 6,
    status: 'in-use',
    location: 'Site B',
    lastTripDestination: 'Guest House',
    images: {
      front: PlaceHolderImages.find((img) => img.id === 'vehicle-front-2')?.imageUrl || '',
      side: PlaceHolderImages.find((img) => img.id === 'vehicle-side-2')?.imageUrl || '',
      odometer: PlaceHolderImages.find((img) => img.id === 'odometer-2')?.imageUrl || '',
    },
    ownerName: "Abc Travels",
    ownerContact: "9876543210",
    ownerAddress: "456, Highway, Mumbai",
  },
  {
    id: 'V003',
    licensePlate: 'MH15EF9012',
    make: 'Force',
    model: 'Traveller',
    capacity: 12,
    status: 'maintenance',
    location: 'Workshop',
    images: {
      front: PlaceHolderImages.find((img) => img.id === 'vehicle-front-3')?.imageUrl || '',
      side: PlaceHolderImages.find((img) => img.id === 'vehicle-side-3')?.imageUrl || '',
      odometer: PlaceHolderImages.find((img) => img.id === 'odometer-3')?.imageUrl || '',
    },
    ownerName: "Samagam Services",
    ownerContact: "9988776655",
    ownerAddress: "123, Main Road, Pune",
  },
];

const initialRequests: TransportRequest[] = [
    {
    id: 'R001',
    userName: 'Narendra Mali',
    contactNumber: '9876543210',
    departmentName: 'Guest Services',
    vehicleType: 'four-wheeler',
    durationFrom: new Date('2024-07-25'),
    durationTo: new Date('2024-07-25'),
    status: 'pending',
    createdAt: new Date(),
    hodApprovalImage: PlaceHolderImages.find((img) => img.id === 'approval-1')?.imageUrl,
    passengerCount: 4,
    destination: 'Pune Airport',
    requestType: 'private',
  },
  {
    id: 'R002',
    userName: 'Akash More',
    contactNumber: '9876543211',
    departmentName: 'Construction',
    vehicleType: 'eicher',
    durationFrom: new Date('2024-07-26'),
    durationTo: new Date('2024-07-28'),
    status: 'pending',
    createdAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    hodApprovalImage: PlaceHolderImages.find((img) => img.id === 'approval-2')?.imageUrl,
    passengerCount: 2,
    destination: 'Mumbai Site',
    requestType: 'private',
  },
  {
    id: 'R003',
    userName: 'Prasad More',
    contactNumber: '9876543212',
    departmentName: 'Management',
    vehicleType: 'four-wheeler',
    durationFrom: new Date('2024-07-27'),
    durationTo: new Date('2024-07-27'),
    status: 'completed',
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    passengerCount: 1,
    destination: 'Local Vendor Meet',
    requestType: 'private',
  },
  {
    id: 'R004',
    userName: 'Rajendra Nandikurle',
    contactNumber: '9876543213',
    departmentName: 'Electrical',
    vehicleType: 'two-wheeler',
    durationFrom: new Date('2024-07-28'),
    durationTo: new Date('2024-07-28'),
    status: 'pending',
    createdAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
    hodApprovalImage: PlaceHolderImages.find((img) => img.id === 'approval-3')?.imageUrl,
    passengerCount: 1,
    destination: 'City Power Office',
    requestType: 'private',
  },
];


const requestManager = {
    _requests: [...initialRequests],
    get all() {
        return this._requests;
    },
    add(request: Omit<TransportRequest, 'id' | 'status' | 'createdAt'>) {
        const newRequest: TransportRequest = {
            ...request,
            id: `R${String(this._requests.length + 1).padStart(3, '0')}`,
            status: 'pending',
            createdAt: new Date(),
        };
        this._requests.unshift(newRequest);
        return newRequest;
    }
}


export const requests = requestManager.all;
export const addRequest = (req: Omit<TransportRequest, 'id' | 'status' | 'createdAt'>) => requestManager.add(req);


export const dispatches: Dispatch[] = [
    {
    id: 'D001',
    requestId: 'R003',
    vehicleId: 'V002',
    driverName: 'Ramesh Singh',
    driverLicense: 'DL123456789',
    conditionPhoto: PlaceHolderImages.find((img) => img.id === 'vehicle-condition-1')?.imageUrl || '',
    dispatchedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];
