import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { ErrorMessage } from '@/components/ErrorMessage';
import { typography, spacing, borderRadius } from '@/theme/typography';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneNumber'>;

const PhoneNumberScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { requestOtp, error, clearError } = useAuth();
  const { showToast } = useNotification();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleContinue = async () => {
    if (!phone.trim()) {
      showToast('Please enter your phone number', ToastType.WARNING);
      return;
    }

    try {
      setLoading(true);
      clearError();

      // Validate E.164 format
      const e164 = phone.replace(/[\s()-]/g, '');
      if (!/^\+[1-9]\d{7,14}$/.test(e164)) {
        showToast(
          'Please use E.164 format (e.g., +2519123456789)',
          ToastType.ERROR
        );
        return;
      }

      const response = await requestOtp(e164);
      if (response.developmentCode) {
        showToast(`Development verification code: ${response.developmentCode}`, ToastType.INFO, 10000);
      }
      navigation.navigate('OtpVerification', { phone: e164 });
    } catch (err) {
      showToast('Failed to request OTP. Please try again.', ToastType.ERROR);
    } finally {
      setLoading(false);
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
              Welcome to GeoTrack
            </Text>
            <Text style={[typography.body1, { color: colors.gray[600] }]}>
              Enter your phone number to get started
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={{ marginBottom: spacing[20] }}>
              <ErrorMessage message={error} />
            </View>
          )}

          {/* Phone Input */}
          <View style={styles.form}>
            <TextInput
              label="Phone Number"
              placeholder="+2519123456789"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              helperText="Use international E.164 format (e.g., +country_code)"
              testID="phone-input"
            />
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
              We'll send a verification code to confirm your phone number. Standard SMS rates may apply.
            </Text>
          </View>

          {/* Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={!phone.trim()}
            variant="primary"
            size="large"
            style={styles.button}
            testID="continue-button"
          />
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
  button: {
    marginTop: spacing[32],
  },
});

export default PhoneNumberScreen;
