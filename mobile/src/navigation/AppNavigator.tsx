import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';

// Screens
import HomeScreen from '@/screens/home/HomeScreen';
import LiveMapScreen from '@/screens/map/LiveMapScreen';
import ContactsScreen from '@/screens/contacts/ContactsScreen';
import LocationHistoryScreen from '@/screens/history/LocationHistoryScreen';
import MessagesScreen from '@/screens/messages/MessagesScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: '#F4F7FC',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: 'Dashboard' }}
    />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen
      name="MapScreen"
      component={LiveMapScreen}
      options={{ title: 'Live Map' }}
    />
  </Stack.Navigator>
);

const ContactsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen
      name="ContactsScreen"
      component={ContactsScreen}
      options={{ title: 'Contacts' }}
    />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen
      name="HistoryScreen"
      component={LocationHistoryScreen}
      options={{ title: 'Location History' }}
    />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen
      name="MessagesScreen"
      component={MessagesScreen}
      options={{ title: 'Messages' }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'dashboard' : 'dashboard-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'location-on' : 'location-on-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'history' : 'history';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chat' : 'chat-bubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          borderTopWidth: 1,
        },
        tabBarLabel: route.name,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{ title: 'Map' }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsStack}
        options={{ title: 'Contacts' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
