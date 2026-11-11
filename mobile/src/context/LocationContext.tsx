import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';
import { locationService } from '@/services/locationService';
import { LocationRecord } from '@/types';
import { logger } from '@/config/logger';
import { AuthState, useAuth } from '@/context/AuthContext';

const TAG = 'LocationContext';

interface LocationContextType {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  syncPendingLocations: () => Promise<void>;
  getHistory: (limit?: number) => Promise<LocationRecord[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: authState } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const watcher = useRef<Location.LocationSubscription | null>(null);
  const sessionReady = useRef<Promise<boolean>>(Promise.resolve(true));

  useEffect(() => {
    sessionReady.current = authState === AuthState.AUTHENTICATED
      ? locationService.setLocationSharing(false).then(() => true).catch((error) => {
        logger.error(TAG, 'Failed to clear location sharing from a previous app session', error);
        return false;
      })
      : Promise.resolve(true);
  }, [authState]);

  const stopRecording = useCallback(async () => {
    watcher.current?.remove();
    watcher.current = null;

    try {
      await locationService.setLocationSharing(false);
      setIsRecording(false);
      logger.info(TAG, 'Location sharing stopped');
    } catch (error) {
      logger.error(TAG, 'Failed to turn off location sharing', error);
      throw error;
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    if (!(await sessionReady.current)) {
      throw new Error('Could not confirm your previous location-sharing session was stopped. Try again.');
    }

    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Share your live location?',
        'Your GPS location and location history will be sent to GeoTrack and visible to authorized administrators while sharing is on. Sharing runs while this app is open. You can stop it at any time.',
        [
          { text: 'Not now', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Agree & start', onPress: () => resolve(true) },
        ],
        { cancelable: true, onDismiss: () => resolve(false) }
      );
    });
    if (!confirmed) return;

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== Location.PermissionStatus.GRANTED) {
      throw new Error('Foreground location permission is required to share your location');
    }

    await locationService.setLocationSharing(true);
    try {
      const syncLocation = (location: Location.LocationObject) => locationService.syncLocations([{
        clientRecordId: uuidv4(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        altitude: location.coords.altitude ?? undefined,
        recordedAt: new Date().toISOString(),
      }]);

      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      await syncLocation(initialLocation);
      watcher.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          void syncLocation(location).catch((error) => {
            logger.error(TAG, 'Failed to sync live location', error);
          });
        }
      );

      setIsRecording(true);
      logger.info(TAG, 'Location sharing started');
    } catch (error) {
      try {
        await locationService.setLocationSharing(false);
      } catch (revokeError) {
        setIsRecording(true);
        logger.error(TAG, 'Failed to revoke location sharing after startup error', revokeError);
      }
      throw error;
    }
  }, [isRecording]);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState !== 'active' && isRecording) {
        void stopRecording().catch((error) => {
          logger.error(TAG, 'Failed to stop location sharing when app became inactive', error);
        });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isRecording, stopRecording]);

  useEffect(() => {
    if (authState !== AuthState.AUTHENTICATED && isRecording) {
      void stopRecording().catch((error) => {
        logger.error(TAG, 'Failed to stop location sharing after logout', error);
      });
    }
  }, [authState, isRecording, stopRecording]);

  const syncPendingLocations = useCallback(async () => {
  }, []);

  const getHistory = useCallback(async (limit: number = 100): Promise<LocationRecord[]> => {
    try {
      const history = await locationService.getHistory(limit);
      logger.info(TAG, 'Location history fetched', { count: history.length });
      return history;
    } catch (error) {
      logger.error(TAG, 'Failed to fetch location history', error);
      throw error;
    }
  }, []);

  const value: LocationContextType = {
    isRecording,
    startRecording,
    stopRecording,
    syncPendingLocations,
    getHistory,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
