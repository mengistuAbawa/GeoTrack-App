import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<any, 'ProfileScreen'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const { mode, setMode, isDark } = useTheme();
  const { showToast } = useNotification();
  const [notifications, setNotifications] = useState(true);
  const [backgroundLocation, setBackgroundLocation] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
            showToast('Logged out successfully', ToastType.SUCCESS);
          } catch (error) {
            showToast('Failed to logout', ToastType.ERROR);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.avatarLarge,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <MaterialIcons name="person" size={48} color={colors.white} />
          </View>
          <View style={{ marginLeft: spacing[16], flex: 1 }}>
            <Text style={[typography.h4, { color: colors.text }]}>
              {user?.fullName || 'User'}
            </Text>
            <Text style={[typography.body2, { color: colors.gray[500], marginTop: spacing[4] }]}>
              {user?.phone}
            </Text>
          </View>
        </View>

        {/* Settings Sections */}

        {/* Account */}
        <SectionTitle title="Account" colors={colors} />
        <Card style={styles.settingCard}>
          <SettingRow
            icon="person"
            label="Edit Profile"
            onPress={() => {}}
            colors={colors}
          />
          <Divider colors={colors} />
          <SettingRow
            icon="email"
            label="Email"
            value={user?.email || 'Not set'}
            onPress={() => {}}
            colors={colors}
          />
          <Divider colors={colors} />
          <SettingRow
            icon="phone"
            label="Phone"
            value={user?.phone}
            colors={colors}
          />
        </Card>

        {/* Location */}
        <SectionTitle title="Location Settings" colors={colors} />
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <MaterialIcons name="location-on" size={20} color={colors.primary} />
              <View style={{ marginLeft: spacing[12], flex: 1 }}>
                <Text style={[typography.subtitle2, { color: colors.text }]}>
                  Background Location
                </Text>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>
                  Allow background location tracking
                </Text>
              </View>
            </View>
            <Switch
              value={backgroundLocation}
              onValueChange={setBackgroundLocation}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </Card>

        {/* Notifications */}
        <SectionTitle title="Notifications" colors={colors} />
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <MaterialIcons
                name="notifications"
                size={20}
                color={colors.primary}
              />
              <View style={{ marginLeft: spacing[12], flex: 1 }}>
                <Text style={[typography.subtitle2, { color: colors.text }]}>
                  Push Notifications
                </Text>
                <Text style={[typography.caption, { color: colors.gray[500] }]}>
                  Receive app notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <Divider colors={colors} />
          <SettingRow
            icon="mail"
            label="Email Notifications"
            onPress={() => {}}
            colors={colors}
          />
        </Card>

        {/* Theme */}
        <SectionTitle title="Appearance" colors={colors} />
        <Card style={styles.settingCard}>
          <SettingRow
            icon={mode === 'dark' ? 'dark-mode' : 'light-mode'}
            label="Theme"
            value={mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System'}
            onPress={() => {
              const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light';
              setMode(nextMode as 'light' | 'dark' | 'auto');
              showToast(`Theme set to ${nextMode}`, ToastType.SUCCESS);
            }}
            colors={colors}
          />
        </Card>

        {/* Privacy & Security */}
        <SectionTitle title="Privacy & Security" colors={colors} />
        <Card style={styles.settingCard}>
          <SettingRow
            icon="lock"
            label="Privacy Settings"
            onPress={() => {}}
            colors={colors}
          />
          <Divider colors={colors} />
          <SettingRow
            icon="security"
            label="Security Audit Log"
            onPress={() => {}}
            colors={colors}
          />
          <Divider colors={colors} />
          <SettingRow
            icon="description"
            label="Privacy Policy"
            onPress={() => {}}
            colors={colors}
          />
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            size="large"
            style={{ marginBottom: spacing[12] }}
          />
          <Button
            title="Delete Account"
            onPress={() =>
              Alert.alert(
                'Delete Account',
                'This action cannot be undone. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    onPress: () => showToast('Account deletion requested', ToastType.INFO),
                    style: 'destructive',
                  },
                ]
              )
            }
            variant="ghost"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SectionTitle = ({ title, colors }: any) => (
  <Text
    style={[
      typography.subtitle1,
      {
        color: colors.text,
        marginHorizontal: spacing[16],
        marginTop: spacing[24],
        marginBottom: spacing[12],
      },
    ]}
  >
    {title}
  </Text>
);

const SettingRow = ({ icon, label, value, onPress, colors }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.settingRow}>
    <View style={styles.settingContent}>
      <MaterialIcons name={icon} size={20} color={colors.primary} />
      <View style={{ marginLeft: spacing[12], flex: 1 }}>
        <Text style={[typography.body2, { color: colors.text }]}>{label}</Text>
        {value && (
          <Text style={[typography.caption, { color: colors.gray[500] }]}>
            {value}
          </Text>
        )}
      </View>
    </View>
    {onPress && (
      <MaterialIcons name="chevron-right" size={20} color={colors.gray[400]} />
    )}
  </TouchableOpacity>
);

const Divider = ({ colors }: any) => (
  <View
    style={{
      height: 1,
      backgroundColor: colors.gray[200],
      marginVertical: spacing[8],
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing[16],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[32],
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingCard: {
    marginBottom: spacing[12],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[12],
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionsContainer: {
    marginTop: spacing[32],
    marginBottom: spacing[32],
  },
});

export default ProfileScreen;
