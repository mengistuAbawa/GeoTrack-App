import React, { useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography, spacing, borderRadius } from '@/theme/typography';
import { ToastType } from '@/context/NotificationContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

const getIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.SUCCESS:
      return 'check-circle';
    case ToastType.ERROR:
      return 'error';
    case ToastType.WARNING:
      return 'warning';
    case ToastType.INFO:
      return 'info';
  }
};

const getColors = (type: ToastType, themeColors: any) => {
  switch (type) {
    case ToastType.SUCCESS:
      return { bg: '#ECFDF5', icon: themeColors.success, text: themeColors.success };
    case ToastType.ERROR:
      return { bg: '#FEE2E2', icon: themeColors.error, text: themeColors.error };
    case ToastType.WARNING:
      return { bg: '#FFFBEB', icon: themeColors.warning, text: themeColors.warning };
    case ToastType.INFO:
      return { bg: '#EFF6FF', icon: themeColors.info, text: themeColors.info };
  }
};

export const Toast: React.FC<ToastProps> = ({ type, message, duration = 3000, onDismiss }) => {
  const { colors } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const toastColors = getColors(type, colors);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (duration > 0) {
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onDismiss?.());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={{
          backgroundColor: toastColors?.bg,
          borderRadius: borderRadius.md,
          padding: spacing[12],
          flexDirection: 'row',
          gap: spacing[12],
          alignItems: 'center',
          marginHorizontal: spacing[16],
          marginBottom: spacing[16],
        }}
      >
        <MaterialIcons name={getIcon(type)} size={20} color={toastColors?.icon} />
        <Text style={[typography.body2, { color: toastColors?.text, flex: 1 }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};
