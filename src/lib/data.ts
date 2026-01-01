import type { Vehicle, TransportRequest, Dispatch } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const vehicles: Vehicle[] = [
  {
    id: 'V001',
    licensePlate: 'KA-01-AB-1234',
    make: 'Toyota',
    model: 'Innova',
    year: 2022,
    capacity: 7,
    status: 'available',
    location: 'Main Campus',
    images: {
      front: PlaceHolderImages.find(p => p.id === 'vehicle-front-1')?.imageUrl || '',
      side: PlaceHolderImages.find(p => p.id === 'vehicle-side-1')?.imageUrl || '',
      odometer: PlaceHolderImages.find(p => p.id === 'odometer-1')?.imageUrl || '',
    },
    lastTripDestination: 'City Center'
  },
  {
    id: 'V002',
    licensePlate: 'MH-12-CD-5678',
    make: 'Maruti Suzuki',
    model: 'Ertiga',
    year: 2021,
    capacity: 7,
    status: 'in-use',
    location: 'Sector 5',
    images: {
      front: PlaceHolderImages.find(p => p.id === 'vehicle-front-2')?.imageUrl || '',
      side: PlaceHolderImages.find(p => p.id === 'vehicle-side-2')?.imageUrl || '',
      odometer: PlaceHolderImages.find(p => p.id === 'odometer-2')?.imageUrl || '',
    },
  },
  {
    id: 'V003',
    licensePlate: 'DL-03-EF-9012',
    make: 'Force',
    model: 'Traveller',
    year: 2020,
    capacity: 12,
    status: 'available',
    location: 'Main Campus',
    images: {
      front: PlaceHolderImages.find(p => p.id === 'vehicle-front-3')?.imageUrl || '',
      side: PlaceHolderImages.find(p => p.id === 'vehicle-side-3')?.imageUrl || '',
      odometer: PlaceHolderImages.find(p => p.id === 'odometer-3')?.imageUrl || '',
    },
    lastTripDestination: 'Airport'
  },
];

export const requests: TransportRequest[] = [
  {
    id: 'R001',
    userName: 'Alice',
    contactNumber: '9876543210',
    departmentName: 'Guest Services',
    vehicleType: 'four-wheeler',
    durationFrom: new Date('2024-07-25'),
    durationTo: new Date('2024-07-27'),
    status: 'pending',
    createdAt: new Date('2024-07-20T10:00:00Z'),
    destination: 'Airport',
    passengerCount: 5,
    hodApprovalImage: PlaceHolderImages.find(p => p.id === 'approval-1')?.imageUrl || '',
  },
  {
    id: 'R002',
    userName: 'Bob',
    contactNumber: '9876543211',
    departmentName: 'Logistics',
    vehicleType: 'four-wheeler',
    durationFrom: new Date('2024-08-01'),
    durationTo: new Date('2024-08-05'),
    status: 'pending',
    createdAt: new Date('2024-07-20T11:30:00Z'),
    destination: 'Warehouse Complex',
    passengerCount: 10,
    hodApprovalImage: PlaceHolderImages.find(p => p.id === 'approval-2')?.imageUrl || '',
  },
  {
    id: 'R003',
    userName: 'Charlie',
    contactNumber: '9876543212',
    departmentName: 'IT Department',
    vehicleType: 'two-wheeler',
    durationFrom: new Date('2024-07-22'),
    durationTo: new Date('2024-07-22'),
    status: 'allocated',
    createdAt: new Date('2024-07-19T15:00:00Z'),
    destination: 'Data Center',
    passengerCount: 2,
    hodApprovalImage: PlaceHolderImages.find(p => p.id === 'approval-3')?.imageUrl || '',
  },
];


export const dispatches: Dispatch[] = [
    {
        id: 'D001',
        requestId: 'R003',
        vehicleId: 'V001',
        driverName: 'John Doe',
        driverLicense: 'DL123456789',
        conditionPhoto: PlaceHolderImages.find(p => p.id === 'vehicle-condition-1')?.imageUrl || '',
        dispatchedAt: new Date('2024-07-19T15:30:00Z'),
    }
];

    