import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useAuth, AuthState } from '@/context/AuthContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { ErrorMessage } from '@/components/ErrorMessage';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '@/services/authService';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, state } = useAuth();
  const { showToast } = useNotification();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (err) {
      showToast('Failed to pick image', ToastType.ERROR);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!fullName.trim()) {
        setError('Full name is required');
        return;
      }

      // Update profile
      await authService.updateProfile(fullName, email || undefined, avatar || undefined);

      showToast('Profile updated successfully', ToastType.SUCCESS);

      // Auto-navigate to main app when auth state becomes authenticated
      // This will happen naturally when the verifyOtp call completes
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to update profile';
      setError(message);
      showToast(message, ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Skip and go to main app
  const handleSkip = () => {
    // If authenticated, navigation will handle it through RootNavigator
    if (state === AuthState.AUTHENTICATED) {
      // Navigation will automatically transition
      return;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[typography.h2, { color: colors.text, marginBottom: spacing[8] }]}>
              Complete Your Profile
            </Text>
            <Text style={[typography.body1, { color: colors.gray[600] }]}>
              This helps your contacts identify you
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={{ marginBottom: spacing[20] }}>
              <ErrorMessage message={error} />
            </View>
          )}

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: colors.gray[100],
                  borderColor: colors.gray[300],
                },
              ]}
            >
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <MaterialIcons
                    name="add-a-photo"
                    size={40}
                    color={colors.gray[400]}
                  />
                  <Text
                    style={[
                      typography.caption,
                      { color: colors.gray[500], marginTop: spacing[8] },
                    ]}
                  >
                    Add Photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              testID="fullname-input"
            />

            <View style={{ marginTop: spacing[16] }}>
              <TextInput
                label="Email Address (Optional)"
                placeholder="john@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                testID="email-input"
              />
            </View>
          </View>

          {/* Info Box */}
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: colors.gray[50],
                borderLeftColor: colors.info,
              },
            ]}
          >
            <Text style={[typography.caption, { color: colors.text }]}>
              Your profile information helps your trusted contacts identify you in the app.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Complete Profile"
              onPress={handleContinue}
              loading={loading}
              variant="primary"
              size="large"
              style={{ marginBottom: spacing[12] }}
              testID="complete-button"
            />
            <Button
              title="Skip for Now"
              onPress={handleSkip}
              variant="ghost"
              size="large"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing[24],
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: spacing[32],
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing[32],
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: spacing[20],
  },
  infoBox: {
    borderLeftWidth: 4,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[12],
    borderRadius: 4,
    marginBottom: spacing[32],
  },
  buttonContainer: {
    marginTop: spacing[32],
  },
});

export default ProfileSetupScreen;
