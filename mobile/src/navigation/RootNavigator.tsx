import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { useAuth, AuthState } from '@/context/AuthContext';
import { Loading } from '@/components/Loading';

// Auth screens
import WelcomeScreen from '@/screens/auth/WelcomeScreen';
import PhoneNumberScreen from '@/screens/auth/PhoneNumberScreen';
import OtpVerificationScreen from '@/screens/auth/OtpVerificationScreen';
import ProfileSetupScreen from '@/screens/auth/ProfileSetupScreen';

// Main app screens
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { state: authState } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Give auth context time to restore session
    if (authState !== AuthState.IDLE) {
      setIsReady(true);
    }
  }, [authState]);

  if (!isReady || authState === AuthState.IDLE || authState === AuthState.LOADING) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {authState === AuthState.AUTHENTICATED ? (
          <Stack.Group key="authenticated">
            <Stack.Screen name="MainApp" component={AppNavigator} />
          </Stack.Group>
        ) : (
          <Stack.Group
            key="unauthenticated"
            screenOptions={{
              animationEnabled: true,
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
            <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
