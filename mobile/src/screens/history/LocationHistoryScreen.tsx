import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { locationService } from '@/services/locationService';
import { LocationRecord } from '@/types';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { typography, spacing } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { formatDistanceToNow } from 'date-fns';

const LocationHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { showToast } = useNotification();
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await locationService.getHistory(100);
      setLocations(history);
    } catch (error) {
      console.error('Failed to load history:', error);
      showToast('Failed to load location history', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading history..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        {locations.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="history"
              size={48}
              color={colors.gray[300]}
            />
            <Text
              style={[
                typography.body2,
                { color: colors.gray[500], marginTop: spacing[12] },
              ]}
            >
              No location history
            </Text>
          </View>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={locations}
            renderItem={({ item }) => (
              <Card style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View>
                    <Text style={[typography.subtitle2, { color: colors.text }]}>
                      {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                    </Text>
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.gray[500], marginTop: spacing[4] },
                      ]}
                    >
                      {new Date(item.recordedAt).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.accuracyBadge}>
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.gray[600], fontSize: 11 },
                      ]}
                    >
                      ±{item.accuracy?.toFixed(0) || '?'}m
                    </Text>
                  </View>
                </View>
              </Card>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </ScrollView>

      {/* Refresh Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={loadHistory}
        >
          <MaterialIcons name="refresh" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing[12],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[64],
  },
  historyCard: {
    marginBottom: spacing[12],
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accuracyBadge: {
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[4],
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing[24],
    right: spacing[24],
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default LocationHistoryScreen;
