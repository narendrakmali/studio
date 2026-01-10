/**
 * React hooks for API interactions
 * Provides convenient hooks with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching transport requests
 */
export function useRequests(filters?: {
  status?: string;
  requestType?: string;
}) {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchRequests = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apiClient.getRequests(filters);
      setState({ data, loading: false, error: null, refetch: fetchRequests });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch requests';
      setState({ data: null, loading: false, error: errorMessage, refetch: fetchRequests });
    }
  }, [filters?.status, filters?.requestType]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return state;
}

/**
 * Hook for fetching a single request
 */
export function useRequest(id: string | null) {
  const [state, setState] = useState<UseApiState<any>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchRequest = useCallback(async () => {
    if (!id) {
      setState({ data: null, loading: false, error: null, refetch: fetchRequest });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apiClient.getRequestById(id);
      setState({ data, loading: false, error: null, refetch: fetchRequest });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch request';
      setState({ data: null, loading: false, error: errorMessage, refetch: fetchRequest });
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return state;
}

/**
 * Hook for fetching vehicles
 */
export function useVehicles(filters?: {
  status?: string;
  type?: string;
}) {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchVehicles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apiClient.getVehicles(filters);
      setState({ data, loading: false, error: null, refetch: fetchVehicles });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch vehicles';
      setState({ data: null, loading: false, error: errorMessage, refetch: fetchVehicles });
    }
  }, [filters?.status, filters?.type]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return state;
}

/**
 * Hook for fetching dispatches
 */
export function useDispatches(filters?: {
  status?: string;
  vehicleId?: string;
  requestId?: string;
}) {
  const [state, setState] = useState<UseApiState<any[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: async () => {},
  });

  const fetchDispatches = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await apiClient.getDispatches(filters);
      setState({ data, loading: false, error: null, refetch: fetchDispatches });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Failed to fetch dispatches';
      setState({ data: null, loading: false, error: errorMessage, refetch: fetchDispatches });
    }
  }, [filters?.status, filters?.vehicleId, filters?.requestId]);

  useEffect(() => {
    fetchDispatches();
  }, [fetchDispatches]);

  return state;
}

/**
 * Generic mutation hook for POST/PATCH/DELETE operations
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState({
    loading: false,
    error: null as string | null,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState({ loading: true, error: null });
    try {
      const data = await mutationFn(variables);
      setState({ loading: false, error: null });
      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Mutation failed';
      setState({ loading: false, error: errorMessage });
      return { data: null, error: errorMessage };
    }
  }, [mutationFn]);

  return { ...state, mutate };
}
