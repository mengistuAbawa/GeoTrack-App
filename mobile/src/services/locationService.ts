import api from '@/config/api';
import { LocationRecord, LocationSyncPayload, LocationSyncResponse } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'LocationService';

interface ApiLocationRecord {
  id: string;
  user_id?: string;
  client_record_id?: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  recorded_at: string;
  received_at?: string;
}

const mapLocation = (record: ApiLocationRecord): LocationRecord => ({
  id: record.id,
  userId: record.user_id,
  clientRecordId: record.client_record_id,
  latitude: Number(record.latitude),
  longitude: Number(record.longitude),
  accuracy: record.accuracy ?? undefined,
  altitude: record.altitude ?? undefined,
  recordedAt: record.recorded_at,
  receivedAt: record.received_at,
});

export const locationService = {
  setLocationSharing: async (enabled: boolean): Promise<void> => {
    try {
      await api.patch('/users/me/location-sharing', { enabled });
      logger.info(TAG, 'Location sharing preference updated', { enabled });
    } catch (error) {
      logger.error(TAG, 'Failed to update location sharing preference', error);
      throw error;
    }
  },

  syncLocations: async (records: LocationSyncPayload['records']): Promise<LocationSyncResponse> => {
    try {
      const payload: LocationSyncPayload = { records };
      const response = await api.post<LocationSyncResponse>('/locations/sync', payload);
      logger.info(TAG, 'Locations synced', { received: response.data.received, processed: response.data.processed });
      return response.data;
    } catch (error) {
      logger.error(TAG, 'Failed to sync locations', error);
      throw error;
    }
  },

  getHistory: async (limit: number = 100, before?: string): Promise<LocationRecord[]> => {
    try {
      const params = { limit, before };
      const response = await api.get<{ locations: ApiLocationRecord[] }>('/locations/history', { params });
      return response.data.locations.map(mapLocation);
    } catch (error) {
      logger.error(TAG, 'Failed to fetch location history', error);
      throw error;
    }
  },

  getSharedWithMe: async () => {
    try {
      const response = await api.get('/locations/shared-with-me');
      return response.data.contacts;
    } catch (error) {
      logger.error(TAG, 'Failed to fetch shared locations', error);
      throw error;
    }
  },

  getSharedHistory: async (userId: string, limit: number = 500): Promise<LocationRecord[]> => {
    try {
      const response = await api.get<{ locations: ApiLocationRecord[] }>(
        `/locations/shared/${userId}/history`,
        { params: { limit } }
      );
      return response.data.locations.map(mapLocation);
    } catch (error) {
      logger.error(TAG, 'Failed to fetch shared history', error);
      throw error;
    }
  },
};
