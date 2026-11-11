import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/Button';
import { typography, spacing, borderRadius } from '@/theme/typography';
import { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo/Illustration */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.illustration,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Text style={{ fontSize: 60, color: colors.white }}>📍</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[typography.h1, { color: colors.text, marginBottom: spacing[16] }]}>
            GeoTrack
          </Text>

          <Text style={[typography.body1, { color: colors.text, marginBottom: spacing[24] }]}>
            Privacy-first location sharing and journey tracking. Share your whereabouts only with trusted contacts.
          </Text>

          {/* Features */}
          <View style={styles.featuresList}>
            <FeatureItem
              icon="📍"
              title="Privacy First"
              description="Control who sees your location"
              colors={colors}
            />
            <FeatureItem
              icon="🔐"
              title="Secure"
              description="End-to-end encrypted messaging"
              colors={colors}
            />
            <FeatureItem
              icon="📊"
              title="Track Journeys"
              description="Record and view your location history"
              colors={colors}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('PhoneNumber')}
            variant="primary"
            size="large"
            style={{ marginBottom: spacing[12] }}
          />
          <Button
            title="Learn More"
            onPress={() => {}}
            variant="ghost"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title, description, colors }: any) => (
  <View style={styles.featureItem}>
    <Text style={{ fontSize: 24, marginRight: spacing[12] }}>{icon}</Text>
    <View>
      <Text style={[typography.subtitle2, { color: colors.text }]}>{title}</Text>
      <Text style={[typography.caption, { color: colors.gray[500] }]}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: spacing[40],
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacing[24],
    flex: 1,
    justifyContent: 'center',
  },
  featuresList: {
    marginTop: spacing[32],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[20],
  },
  buttonContainer: {
    paddingHorizontal: spacing[24],
    paddingBottom: spacing[32],
    gap: spacing[12],
  },
});

export default WelcomeScreen;
