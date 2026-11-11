import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const HomeScreen: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { isRecording, startRecording, stopRecording } = useLocation();
  const { colors } = useTheme();
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleRecording = async () => {
    try {
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to change location sharing',
        ToastType.ERROR
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[typography.body2, { color: colors.gray[600] }]}>
              Welcome back,
            </Text>
            <Text style={[typography.h3, { color: colors.text }]}>
              {user?.fullName || user?.phone}
            </Text>
          </View>
          <View
            style={[
              styles.avatarPlaceholder,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <MaterialIcons name="person" size={24} color={colors.white} />
          </View>
        </View>

        {/* Recording Status Card */}
        <Card style={styles.recordingCard}>
          <View style={styles.recordingContent}>
            <View>
              <Text style={[typography.subtitle2, { color: colors.gray[600] }]}>
                Location Sharing
              </Text>
              <Text
                style={[
                  typography.h4,
                  {
                    color: isRecording ? colors.success : colors.error,
                    marginTop: spacing[4],
                  },
                ]}
              >
                {isRecording ? 'Sharing live GPS' : 'Not sharing'}
              </Text>
            </View>
            <View
              style={[
                styles.recordingIndicator,
                {
                  backgroundColor: isRecording ? colors.success : colors.gray[300],
                },
              ]}
            >
              <MaterialIcons
                name={isRecording ? 'location-on' : 'location-off'}
                size={24}
                color={colors.white}
              />
            </View>
          </View>

          <Button
            title={isRecording ? 'Stop Sharing' : 'Share My Location'}
            onPress={handleToggleRecording}
            variant={isRecording ? 'danger' : 'primary'}
            size="large"
            style={{ marginTop: spacing[16] }}
          />
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            label="Trusted Contacts"
            value="0"
            colors={colors}
          />
          <StatCard
            icon="history"
            label="Journeys Tracked"
            value="0"
            colors={colors}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[typography.h4, { color: colors.text, marginBottom: spacing[12] }]}>
            Recent Activity
          </Text>

          <Card>
            <View style={styles.emptyState}>
              <MaterialIcons
                name="history"
                size={40}
                color={colors.gray[300]}
              />
              <Text
                style={[
                  typography.body2,
                  {
                    color: colors.gray[500],
                    marginTop: spacing[12],
                    textAlign: 'center',
                  },
                ]}
              >
                No recent activity
              </Text>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[typography.h4, { color: colors.text, marginBottom: spacing[12] }]}>
            Quick Actions
          </Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                borderColor: colors.gray[200],
              },
            ]}
          >
            <MaterialIcons name="add-person" size={20} color={colors.primary} />
            <Text style={[typography.body2, { color: colors.text, marginLeft: spacing[12] }]}>
              Add Contact
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                borderColor: colors.gray[200],
                marginTop: spacing[8],
              },
            ]}
          >
            <MaterialIcons name="settings" size={20} color={colors.primary} />
            <Text style={[typography.body2, { color: colors.text, marginLeft: spacing[12] }]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, label, value, colors }: any) => (
  <Card style={styles.statCard}>
    <MaterialIcons name={icon} size={24} color={colors.primary} />
    <Text style={[typography.caption, { color: colors.gray[600], marginTop: spacing[8] }]}>
      {label}
    </Text>
    <Text style={[typography.h4, { color: colors.text, marginTop: spacing[4] }]}>
      {value}
    </Text>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[16],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[24],
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCard: {
    marginBottom: spacing[20],
  },
  recordingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[16],
  },
  recordingIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[12],
    marginBottom: spacing[24],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[16],
  },
  section: {
    marginBottom: spacing[24],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[32],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[12],
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
});

export default HomeScreen;
