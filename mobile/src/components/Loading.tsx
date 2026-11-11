import React from 'react';
import { View, ActivityIndicator, Text, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({ message, fullScreen = false, style }) => {
  const { colors } = useTheme();

  const containerStyle: ViewStyle = fullScreen
    ? {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }
    : {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
      };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text style={[typography.body2, { color: colors.gray[500], marginTop: 16 }]}>
          {message}
        </Text>
      )}
    </View>
  );
};
