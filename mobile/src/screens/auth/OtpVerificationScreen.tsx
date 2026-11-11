import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotification, ToastType } from '@/context/NotificationContext';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { ErrorMessage } from '@/components/ErrorMessage';
import { typography, spacing } from '@/theme/typography';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

const OtpVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { phone } = route.params;
  const { verifyOtp, error, clearError, requestOtp } = useAuth();
  const { showToast } = useNotification();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleVerify = async () => {
    if (code.length !== 6) {
      showToast('Please enter the 6-digit code', ToastType.WARNING);
      return;
    }

    try {
      setLoading(true);
      clearError();
      await verifyOtp(phone, code);
    } catch (err) {
      showToast('Invalid or expired code. Please try again.', ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendTimer(60);
      const response = await requestOtp(phone);
      showToast(
        response.developmentCode
          ? `Development verification code: ${response.developmentCode}`
          : 'Verification code sent',
        response.developmentCode ? ToastType.INFO : ToastType.SUCCESS,
        10000
      );
    } catch (err) {
      showToast('Failed to resend code', ToastType.ERROR);
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
              Verify Your Phone
            </Text>
            <Text style={[typography.body1, { color: colors.gray[600] }]}>
              We sent a code to {phone}
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={{ marginBottom: spacing[20] }}>
              <ErrorMessage message={error} />
            </View>
          )}

          {/* OTP Input */}
          <View style={styles.form}>
            <TextInput
              label="Verification Code"
              placeholder="000000"
              value={code}
              onChangeText={(text) => setCode(text.replace(/\D/g, '').slice(0, 6))}
              keyboardType="numeric"
              maxLength={6}
              testID="otp-input"
            />
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={[typography.body2, { color: colors.gray[600] }]}>
              Didn&apos;t receive the code?
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendTimer > 0}
            >
              <Text
                style={[
                  typography.body2,
                  {
                    color: resendTimer > 0 ? colors.gray[400] : colors.primary,
                    fontWeight: '600',
                    marginTop: spacing[4],
                  },
                ]}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Verify"
              onPress={handleVerify}
              loading={loading}
              disabled={code.length !== 6}
              variant="primary"
              size="large"
              style={{ marginBottom: spacing[12] }}
              testID="verify-button"
            />
            <Button
              title="Change Phone Number"
              onPress={() => navigation.goBack()}
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
  form: {
    marginBottom: spacing[20],
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing[32],
  },
  buttonContainer: {
    marginTop: spacing[32],
  },
});

export default OtpVerificationScreen;
