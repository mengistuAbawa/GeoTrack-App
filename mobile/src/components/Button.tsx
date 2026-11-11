import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography, spacing, borderRadius } from '@/theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  testID,
}) => {
  const { colors } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[8],
    };

    const sizes: Record<'small' | 'medium' | 'large', ViewStyle> = {
      small: { paddingVertical: spacing[8], paddingHorizontal: spacing[12] },
      medium: { paddingVertical: spacing[12], paddingHorizontal: spacing[16] },
      large: { paddingVertical: spacing[16], paddingHorizontal: spacing[20] },
    };

    const variants: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.gray[200],
        borderWidth: 1,
        borderColor: colors.gray[300],
      },
      danger: {
        backgroundColor: colors.error,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...base,
      ...sizes[size],
      ...variants[variant],
      opacity: disabled || loading ? 0.6 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantColors: Record<string, string> = {
      primary: colors.white,
      secondary: colors.text,
      danger: colors.white,
      ghost: colors.primary,
    };

    return {
      ...typography.button,
      color: variantColors[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      activeOpacity={0.7}
    >
      {loading && <ActivityIndicator color={getTextStyle().color} size="small" />}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};
