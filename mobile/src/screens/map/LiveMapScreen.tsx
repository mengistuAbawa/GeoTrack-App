import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { typography, spacing } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const LiveMapScreen: React.FC = () => {
  const { colors } = useTheme();
  const { isRecording, startRecording, stopRecording } = useLocation();
  const { showToast } = useNotification();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<Location.PermissionStatus | null>(null);

  // Request location permission and get current location
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermission(status);

        if (status !== Location.PermissionStatus.GRANTED) {
          showToast(
            'Location permission is required to use the map',
            ToastType.WARNING
          );
          setLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(currentLocation);
      } catch (error) {
        console.error('Failed to get location:', error);
        showToast('Failed to access location', ToastType.ERROR);
      } finally {
        setLoading(false);
      }
    };

    requestLocationPermission();
  }, []);

  const handleRecordingToggle = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        showToast('Location sharing stopped', ToastType.SUCCESS);
      } else {
        await startRecording();
      }
    } catch (error) {
      console.error('Failed to toggle recording:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to change location sharing',
        ToastType.ERROR
      );
    }
  };

  const handleReferCenter = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
    } catch (error) {
      showToast('Failed to get current location', ToastType.ERROR);
    }
  };

  const handleMapTypeToggle = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  if (permission !== Location.PermissionStatus.GRANTED) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.permissionContainer}>
          <MaterialIcons name="location-off" size={48} color={colors.error} />
          <Text
            style={[
              typography.h4,
              { color: colors.text, marginTop: spacing[16] },
            ]}
          >
            Location Access Required
          </Text>
          <Text
            style={[
              typography.body2,
              { color: colors.gray[600], marginTop: spacing[12], textAlign: 'center' },
            ]}
          >
            GeoTrack needs access to your location to display the map and track journeys.
          </Text>
          <Button
            title="Enable Location"
            onPress={() => Linking.openSettings()}
            variant="primary"
            size="large"
            style={{ marginTop: spacing[24] }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            pinColor={isRecording ? colors.success : colors.error}
          />
        )}
      </MapView>

      {/* Controls Overlay */}
      <View style={styles.controlsContainer}>
        {/* Recording Status */}
        <Card style={[styles.statusCard, { backgroundColor: colors.white }]}>
          <View style={styles.statusContent}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isRecording ? colors.success : colors.gray[300],
                },
              ]}
            />
            <Text
              style={[
                typography.body2,
                { color: isRecording ? colors.success : colors.gray[600] },
              ]}
            >
              {isRecording ? 'Sharing live GPS' : 'Not sharing'}
            </Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.buttonSmall,
              {
                backgroundColor: colors.white,
                borderColor: colors.gray[200],
                borderWidth: 1,
              },
            ]}
            onPress={handleReferCenter}
          >
            <MaterialIcons name="my-location" size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonSmall,
              {
                backgroundColor: colors.white,
                borderColor: colors.gray[200],
                borderWidth: 1,
              },
            ]}
            onPress={handleMapTypeToggle}
          >
            <MaterialIcons name="layers" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Button
            title={isRecording ? 'Stop sharing' : 'Share location'}
            onPress={handleRecordingToggle}
            variant={isRecording ? 'danger' : 'primary'}
            size="small"
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[24],
  },
  controlsContainer: {
    position: 'absolute',
    bottom: spacing[24],
    left: spacing[16],
    right: spacing[16],
  },
  statusCard: {
    marginBottom: spacing[12],
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing[8],
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing[8],
    alignItems: 'center',
  },
  buttonSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LiveMapScreen;
