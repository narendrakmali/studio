
import type { Vehicle, TransportRequest, Dispatch } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const vehicles: Vehicle[] = [];

const initialRequests: TransportRequest[] = [];


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


export const dispatches: Dispatch[] = [];
