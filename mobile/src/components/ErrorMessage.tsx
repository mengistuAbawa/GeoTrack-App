import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, title = 'Error' }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: '#FEE2E2',
        borderRadius: borderRadius.md,
        padding: spacing[12],
        flexDirection: 'row',
        gap: spacing[12],
      }}
    >
      <MaterialIcons name="error-outline" size={24} color={colors.error} />
      <View style={{ flex: 1 }}>
        <Text style={[typography.subtitle2, { color: colors.error }]}>{title}</Text>
        <Text style={[typography.caption, { color: colors.error, marginTop: spacing[4] }]}>
          {message}
        </Text>
      </View>
    </View>
  );
};
