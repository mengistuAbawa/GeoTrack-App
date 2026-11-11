# GeoTrack Mobile Application

A privacy-first location tracking, journey history, and private messaging mobile application built with React Native, TypeScript, and Expo.

## Features

- **Authentication**: Phone number registration with OTP verification
- **Location Tracking**: Record and track location journeys
- **Live Map**: Google Maps integration with real-time location display
- **Contacts Management**: Trusted contact management with sharing requests
- **Location History**: View detailed location history and journeys
- **Private Messaging**: End-to-end encrypted messaging with trusted contacts
- **Profile Management**: User profile with privacy settings
- **Offline Support**: Local SQLite storage for offline location recording
- **Dark Mode**: Light and dark theme support

## Prerequisites

- Node.js 16+ and npm/yarn
- Node.js 20+ and npm (Expo CLI is included with the project)
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio with SDK 33+ (for Android development)

## Project Structure

```
src/
  assets/              # Images, icons, fonts
  components/          # Reusable UI components
  config/              # Configuration (API, logger, database)
  context/             # React Context providers (Auth, Theme, Location, Notifications)
  navigation/          # Navigation structure
  screens/             # Screen components organized by feature
    auth/              # Authentication screens
    home/              # Dashboard
    map/               # Live map screen
    contacts/          # Contacts management
    history/           # Location history
    messages/          # Messaging screens
    profile/           # User profile
  services/            # API service modules
  theme/               # Design system (colors, typography, spacing)
  types/               # TypeScript type definitions
  utils/               # Utility functions
```

## Installation

1. **Install dependencies**:

```bash
cd mobile
npm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env
```

Set `.env` to the same backend used by the admin dashboard. Choose a URL that is reachable from the device:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_ENABLE_DEV_LOGGING=true
```

- Android emulator: `http://10.0.2.2:5000/api`
- Physical phone: `http://<your-computer-LAN-IP>:5000/api`
- iOS simulator or local web: `http://localhost:5000/api`

In the backend `.env`, add the web origins you use to `CLIENT_ORIGIN` (for example `http://localhost:5173,http://localhost:8081`). Native iOS and Android API requests do not use browser CORS.

3. **Configure native permissions** (already configured in `app.json`):

The app requests:
- **iOS**: Location (foreground and background), Camera
- **Android**: Location (foreground and background), Internet

## Running the App

### Development

Start the local Expo CLI:

```bash
npx expo start
```

Then choose:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

### Web

```bash
npm run web
```

## Building

### Prebuild

Configure native projects:

```bash
npm run prebuild
```

### EAS Build (Recommended)

First, install EAS CLI:

```bash
npm install -g eas-cli
```

Configure EAS:

```bash
eas init
```

Build for iOS:

```bash
npm run build:ios
```

Build for Android:

```bash
npm run build:android
```

## API Integration

The app connects to the GeoTrack backend API. Key service modules:

- `authService`: Authentication (OTP, token management)
- `userService`: User profile management
- `locationService`: Location sync and history
- `sharingService`: Sharing requests and contact management
- `messageService`: Messaging
- `notificationService`: Push notifications

All services use centralized Axios client with automatic token injection and error handling.

## TypeScript

Strict TypeScript mode is enabled. Run type checking:

```bash
npm run type-check
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Testing

Run tests:

```bash
npm test
```

Run tests in CI mode:

```bash
npm run test:ci
```

## Secure Storage

- **Auth Tokens**: Stored in `expo-secure-store` (Android Keystore, iOS Keychain)
- **User Data**: Cached in AsyncStorage (not sensitive)
- **Location Data**: Stored locally in SQLite until sync

## Privacy & Security

- Location sharing is opt-in and requires explicit user consent
- Users can revoke access at any time
- All API communications use HTTPS
- OTP codes are validated on the backend
- Tokens auto-refresh on expiry
- Rate limiting handled by backend and client

## Offline Support

- Pending locations stored in local SQLite
- Automatic sync when network connectivity returns
- Unique client-generated record IDs prevent duplicates
- Last sync timestamp tracked for conflict resolution

## Theme System

The app uses a centralized design system:

- **Colors**: Primary (#173F91), Accent (#3478F6), Success (#16A36A), Error (#DC2626)
- **Typography**: Consistent font sizes and weights
- **Spacing**: 8px base unit for consistent spacing
- **Components**: Reusable, themeable UI components

## Troubleshooting

### Connection Issues

1. Ensure backend is running and accessible
2. Check `.env` `EXPO_PUBLIC_API_BASE_URL`
3. Verify network connectivity on device/simulator
4. Check firewall/proxy settings

### iOS Build Issues

- Clear cache: `npm run prebuild -- --clean`
- Update Xcode: `xcode-select --install`

### Android Build Issues

- Clear cache: `npm run prebuild -- --clean`
- Update Android SDK and gradlew: `./gradlew updateDependencies`

### Location Permissions

- iOS: Grant permission in Settings > GeoTrack > Location
- Android: Grant permission in app settings

## License

Proprietary - GeoTrack

## Support

For issues and questions, contact the development team.
