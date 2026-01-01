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
    departmentName: 'Guest Services',
    passengerCount: 5,
    destination: 'Airport',
    hodApprovalImage: PlaceHolderImages.find(p => p.id === 'approval-1')?.imageUrl || '',
    status: 'pending',
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'R002',
    departmentName: 'Logistics',
    passengerCount: 10,
    destination: 'Warehouse Complex',
    hodApprovalImage: PlaceHolderImages.find(p => p.id === 'approval-2')?.imageUrl || '',
    status: 'pending',
    createdAt: new Date('2024-07-20T11:30:00Z'),
  },
  {
    id: 'R003',
    departmentName: 'IT Department',
    passengerCount: 2,
    destination: 'Data Center',
    hodApprovalImage: PlaceHolderImages.find(p => p.id === 'approval-3')?.imageUrl || '',
    status: 'allocated',
    createdAt: new Date('2024-07-19T15:00:00Z'),
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
