import { useState, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { v4 as uuidv4 } from 'uuid';
import { LocationRecord } from '@/types';
import { logger } from '@/config/logger';

const TAG = 'useLocationTracking';
const LOCATION_TRACKING_TASK = 'location-tracking-task';

interface LocationRecordData {
  clientRecordId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  recordedAt: string;
}

/**
 * Custom hook for managing background location tracking
 */
export const useLocationTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);
  const recordsRef = useRef<LocationRecordData[]>([]);

  // Define background task
  TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }) => {
    if (error) {
      logger.error(TAG, 'Background location error', error);
      return;
    }

    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      for (const location of locations) {
        const record: LocationRecordData = {
          clientRecordId: uuidv4(),
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy ?? undefined,
          altitude: location.coords.altitude ?? undefined,
          recordedAt: new Date(location.timestamp).toISOString(),
        };

        recordsRef.current.push(record);
        setLastLocation(location);
        logger.debug(TAG, 'Location recorded', record);
      }
    }
  });

  const startTracking = useCallback(async () => {
    try {
      const permission = await Location.requestBackgroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Background location permission denied');
      }

      await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10, // Update every 10 meters
        timeInterval: 5000, // Update every 5 seconds
        showsBackgroundLocationIndicator: true,
      });

      setIsTracking(true);
      logger.info(TAG, 'Location tracking started');
    } catch (error) {
      logger.error(TAG, 'Failed to start tracking', error);
      throw error;
    }
  }, []);

  const stopTracking = useCallback(async () => {
    try {
      const isTaskRunning = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING_TASK);
      if (isTaskRunning) {
        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
      }

      setIsTracking(false);
      logger.info(TAG, 'Location tracking stopped');
    } catch (error) {
      logger.error(TAG, 'Failed to stop tracking', error);
      throw error;
    }
  }, []);

  const getRecords = useCallback((): LocationRecordData[] => {
    return [...recordsRef.current];
  }, []);

  const clearRecords = useCallback(() => {
    recordsRef.current = [];
    logger.info(TAG, 'Location records cleared');
  }, []);

  return {
    isTracking,
    lastLocation,
    startTracking,
    stopTracking,
    getRecords,
    clearRecords,
  };
};
