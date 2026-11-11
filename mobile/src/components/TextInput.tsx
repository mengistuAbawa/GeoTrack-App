import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { typography, spacing, borderRadius } from '@/theme/typography';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
  testID?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  error,
  helperText,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  testID,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const borderColor =
    error && value ? colors.error : isFocused ? colors.primary : colors.gray[300];

  return (
    <View style={style}>
      {label && (
        <Text style={[typography.subtitle2, { color: colors.text, marginBottom: spacing[8] }]}>
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: multiline ? 'flex-start' : 'center',
          borderWidth: 1,
          borderColor,
          borderRadius: borderRadius.md,
          backgroundColor: colors.white,
          paddingHorizontal: spacing[12],
          paddingVertical: multiline ? spacing[12] : spacing[0],
        }}
      >
        <RNTextInput
          style={{
            flex: 1,
            paddingVertical: spacing[12],
            fontSize: 16,
            color: colors.text,
            fontFamily: 'System',
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          testID={testID}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ marginLeft: spacing[8] }}
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={[
            typography.caption,
            { color: colors.error, marginTop: spacing[6] },
          ]}
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text
          style={[
            typography.caption,
            { color: colors.gray[500], marginTop: spacing[6] },
          ]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};
